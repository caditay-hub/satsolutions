"use client";

/**
 * Вкладка «План объекта» калькулятора объектива (SAT Camera Designer, этап C).
 * План, камеры и расчёт живут только в браузере клиента (решение владельца 10.11):
 * автосохранение в IndexedDB, файл проекта .satplan, PNG и печать. На сервер уходит только
 * заявка — и картинка плана, если клиент сам поставил галочку.
 *
 * Математика — lib/cameraDesigner/plan (тесты plan.test.ts); растровый анализ — в воркере.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal, flushSync } from "react-dom";
import { trackConversion } from "@/lib/gtag";
import { getGclid } from "@/lib/gclid";
import { compute } from "@/lib/cameraDesigner/calculate";
import { parseQuery } from "@/lib/cameraDesigner/query";
import { fill, makeFmt } from "@/lib/cameraDesigner/format";
import { levelColor } from "@/lib/cameraDesigner/palette";
import { groundRangeForPpm, opticsFromFov, sideGeometry } from "@/lib/cameraDesigner/optics";
import { ENGINE_VERSION, PROFILES, visibleLevels, type LevelCode } from "@/lib/cameraDesigner/standards";
import type { CdPlanUi } from "@/lib/cameraDesigner/planContent";
import { analyze, type AnalysisInput, type AnalysisResult } from "@/lib/cameraDesigner/plan/analysis";
import { blindRadius, frameOf, inPolygon, tiltForAim, dist, type Segment, type Vec2 } from "@/lib/cameraDesigner/plan/geometry";
import {
  DEFAULT_CABLE_M, PLAN_LIMITS, cableRun, emptyProject, isPlanImageUrl, isZoom, opticsAt, parseEst, parseProject, planBounds, poseOf, rescaleProject,
  type CamSpec, type PlanCamera, type PlanProject,
} from "@/lib/cameraDesigner/plan/project";
import { exampleProject, isExampleId } from "@/lib/cameraDesigner/plan/example";
import { DEFAULT_SETTINGS, type EstSettings } from "@/lib/cameraDesigner/estimate/estimate";
import type { CdEstUi } from "@/lib/cameraDesigner/estContent";
import { EstimatePanel, type EstInput, type EstView } from "./EstimatePanel";
import { KpSheet, kpDate } from "./KpSheet";
import type { PlanCameraInfo, PlanCatalogCamera } from "@/app/api/camera-designer/cameras/route";
import { PlanCanvas, type Tool } from "./PlanCanvas";
import { PlanVectors, type Draft, type Selection } from "./PlanVectors";
import { download, idbClear, idbLoad, idbSave, loadImage, loadRaster, openPdf, renderPdfPage, sniff, type PlanImage } from "./planIO";

type Props = {
  ui: CdPlanUi; est: CdEstUi; levels: Record<LevelCode, { name: string }>; ruLevels: Record<LevelCode, string>; locale: string;
  /** Вход с первого экрана: «Смета и КП» (#estimate) — смета без плана, «План объекта» (#plan) — план; n растёт с каждым переходом. */
  view?: { v: "plan" | "estimate"; n: number };
};

/** Смета без плана (этап D): камеры из каталога списком, средняя длина кабеля и высота. */
type ManualRow = { cam: PlanCatalogCamera; qty: number; outdoor: boolean };
type ManualState = { rows: ManualRow[]; mountM: number; cableM: number; est: EstSettings };
const emptyManual = (): ManualState => ({ rows: [], mountM: 3, cableM: DEFAULT_CABLE_M, est: { ...DEFAULT_SETTINGS } });

const RES = [[1920, 1080], [2560, 1440], [2688, 1520], [2560, 1944], [2880, 1620], [3200, 1800], [3840, 2160], [4000, 3000]] as const;
const FILE_FORMAT = "sat-camera-plan-file";
const SITE = "https://satsolutions.uz";
const norm = (s: string) => s.toLowerCase().replace(/[\s\-_/().]/g, "");
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);

/* ─────────── мелкие поля ─────────── */

const inputCls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums outline-none focus:border-brand-500";
const btnCls = "inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand-400 disabled:opacity-50";
const primaryCls = "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60";
const card = "rounded-2xl border border-slate-200 bg-white p-4";
const h3 = "text-sm font-black text-slate-900";

/** Числовое поле: значение применяется, только когда введено корректное число в пределах. */
function Num(p: { id: string; label: string; value: number; min: number; max: number; dec: string; onChange: (v: number) => void; hint?: string }) {
  const show = (v: number) => String(Math.round(v * 100) / 100).replace(".", p.dec);
  const [t, setT] = useState(show(p.value));
  const [bad, setBad] = useState(false);
  useEffect(() => {
    const cur = Number(t.replace(",", "."));
    if (!(Math.abs(cur - p.value) < 0.005)) { setT(show(p.value)); setBad(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.value]);
  return (
    <div>
      <label htmlFor={p.id} className="mb-1 block text-xs font-semibold text-slate-600">{p.label}</label>
      <input id={p.id} type="text" inputMode="decimal" autoComplete="off" value={t} aria-invalid={bad || undefined}
        className={`${inputCls} ${bad ? "border-red-400 bg-red-50" : ""}`}
        onChange={(e) => {
          setT(e.target.value);
          const s = e.target.value.trim().replace(",", ".");
          const v = /^-?\d+(\.\d*)?$/.test(s) ? Number(s) : NaN;
          const ok = Number.isFinite(v) && v >= p.min && v <= p.max;
          setBad(!ok);
          if (ok) p.onChange(v);
        }} />
      {p.hint ? <p className="mt-1 text-[11px] leading-snug text-slate-500">{p.hint}</p> : null}
    </div>
  );
}

/* ─────────── основной компонент ─────────── */

export function CameraPlanner({ ui, est, levels, ruLevels, locale, view }: Props) {
  const { num, dec } = makeFmt(locale);
  const [project, setProject] = useState<PlanProject>(emptyProject);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [armed, setArmed] = useState<CamSpec | null>(null);
  const [selected, setSelected] = useState<Selection>(null);
  const [draft, setDraft] = useState<Draft>(null);
  const [scaleText, setScaleText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageWarn, setStorageWarn] = useState(false);
  const [pdf, setPdf] = useState<{ doc: Awaited<ReturnType<typeof openPdf>>; page: number } | null>(null);
  const [gridW, setGridW] = useState(50);
  const [gridH, setGridH] = useState(30);
  const [fitKey, setFitKey] = useState("0");
  const [dragging, setDragging] = useState(false);
  /** Смета без плана (этап D) — отдельный экран вместо стартового. */
  const [manualOn, setManualOn] = useState(false);
  useEffect(() => { if (view && view.n > 0) { setManualOn(view.v === "estimate"); setError(null); } }, [view]);
  const fileInput = useRef<HTMLInputElement>(null);
  const projInput = useRef<HTMLInputElement>(null);

  const patch = useCallback((f: (p: PlanProject) => PlanProject) => setProject((p) => f(p)), []);

  /* ── восстановление и автосохранение ── */
  useEffect(() => {
    let alive = true;
    // ?example=office — пример с превью на главной; свой сохранённый план без спроса не затираем
    const ex = new URLSearchParams(window.location.search).get("example");
    idbLoad().then((v) => {
      const o = v as { project?: unknown; image?: unknown } | undefined;
      const pr = o ? parseProject(o.project) : null;
      if (alive && pr && (o!.image === null || isPlanImageUrl(o!.image))) {
        setProject(pr);
        setBgUrl((o!.image as string | null) ?? null);
        setFitKey(uid());
        return pr.cams.length > 0 || pr.walls.length > 0 || pr.zones.length > 0;
      }
      return false;
    }).catch(() => false).then((hasOwn) => {
      if (!alive) return;
      if (isExampleId(ex)) {
        // параметр убираем: обновление страницы не должно снова подменять план примером
        const u = new URL(window.location.href);
        u.searchParams.delete("example");
        window.history.replaceState(window.history.state, "", `${u.pathname}${u.search}${u.hash}`);
        if (!hasOwn || window.confirm(ui.exampleReplace)) resetTo(exampleProject(ex), null);
      }
      setRestored(true);
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!restored) return;
    const t = setTimeout(() => {
      const save = project.bg ? idbSave({ project: { ...project, updatedAt: new Date().toISOString() }, image: bgUrl }) : idbClear();
      save.catch(() => setStorageWarn(true));
    }, 800);
    return () => clearTimeout(t);
  }, [project, bgUrl, restored]);

  /* ── уровни выбранного профиля ── */
  const lv = useMemo(() => visibleLevels(project.std, project.all), [project.std, project.all]);
  const levelsPpm = useMemo(() => lv.map((l) => l.ppm), [lv]);
  const usedScale = project.bg?.kind === "image" ? project.bg.scale ?? 1 : 1;
  const calibrated = project.bg?.kind === "grid" || (project.bg?.kind === "image" && project.bg.scale !== null);
  const bounds = useMemo(() => {
    if (!project.bg) return null;
    return project.bg.kind === "grid" ? planBounds(project.bg) : { x: 0, y: 0, w: project.bg.wPx * usedScale, h: project.bg.hPx * usedScale };
  }, [project.bg, usedScale]);

  /* ── анализ в воркере ── */
  const worker = useRef<Worker | null>(null);
  const job = useRef(0);
  const [result, setResult] = useState<{ r: AnalysisResult; bounds: NonNullable<typeof bounds>; levels: number[]; zones: Vec2[][]; showOverlap: boolean } | null>(null);
  useEffect(() => {
    try { worker.current = new Worker(new URL("./analysis.worker.ts", import.meta.url)); } catch { worker.current = null; }
    return () => worker.current?.terminate();
  }, []);

  const analysisKey = JSON.stringify([project.cams, project.walls, project.zones, project.targetM, levelsPpm, calibrated, bounds]);
  useEffect(() => {
    if (!bounds || !calibrated) { setResult(null); return; }
    const poses = project.cams.map(poseOf).filter((x): x is NonNullable<typeof x> => !!x);
    const input: AnalysisInput = {
      bounds, maxCells: dragging ? 40000 : 220000, targetM: project.targetM,
      cams: poses, walls: project.walls, zones: project.zones, levelsPpm,
    };
    const meta = { bounds, levels: levelsPpm, zones: project.zones, showOverlap: project.showOverlap };
    const id = ++job.current;
    const t = setTimeout(() => {
      const w = worker.current;
      if (w) {
        w.onmessage = (e: MessageEvent<{ id: number; r: AnalysisResult }>) => { if (e.data.id === job.current) setResult({ r: e.data.r, ...meta }); };
        w.postMessage({ id, input });
      } else {
        setResult({ r: analyze(input), ...meta });
      }
    }, dragging ? 16 : 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisKey, dragging, project.showOverlap]);

  /* ── растр покрытия → картинка ── */
  const [heatUrl, setHeatUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!result) { setHeatUrl(null); return; }
    const c = paintHeat(result);
    let url: string | null = null, alive = true;
    c.toBlob((b) => { if (b && alive) { url = URL.createObjectURL(b); setHeatUrl(url); } });
    return () => { alive = false; if (url) setTimeout(() => URL.revokeObjectURL(url!), 2000); };
  }, [result]);
  function paintHeat({ r, levels: L, zones, showOverlap, bounds: B }: { r: AnalysisResult; levels: number[]; zones: Vec2[][]; showOverlap: boolean; bounds: { x: number; y: number } }) {
    const c = document.createElement("canvas");
    c.width = r.cols; c.height = r.rows;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(r.cols, r.rows);
    const n = L.length;
    const rgb = Array.from({ length: n + 1 }, (_, b) => {
      const hex = b ? levelColor(n - b, n) : "#000000";
      return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    });
    for (let iy = 0; iy < r.rows; iy++) for (let ix = 0; ix < r.cols; ix++) {
      const k = iy * r.cols + ix, b = r.best[k];
      if (!b) continue;
      let [R, G, Bl] = rgb[b];
      // перекрытие — диагональная штриховка с шагом ~0,6 м независимо от размера клетки
      if (showOverlap && r.count[k] >= 2 && Math.floor((ix + iy) * r.cell / 0.2) % 6 < 2) { R = R * 0.62; G = G * 0.62; Bl = Bl * 0.62 + 30; }
      img.data.set([R, G, Bl, 255], k * 4);
    }
    // непокрытые места внутри зон охраны — красным
    for (const z of zones) {
      if (z.length < 3) continue;
      const xs = z.map((p) => p.x), ys = z.map((p) => p.y);
      const x0 = Math.max(0, Math.floor((Math.min(...xs) - B.x) / r.cell)), x1 = Math.min(r.cols - 1, Math.floor((Math.max(...xs) - B.x) / r.cell));
      const y0 = Math.max(0, Math.floor((Math.min(...ys) - B.y) / r.cell)), y1 = Math.min(r.rows - 1, Math.floor((Math.max(...ys) - B.y) / r.cell));
      for (let iy = y0; iy <= y1; iy++) for (let ix = x0; ix <= x1; ix++) {
        const k = iy * r.cols + ix;
        if (r.best[k] || !inPolygon({ x: B.x + (ix + 0.5) * r.cell, y: B.y + (iy + 0.5) * r.cell }, z)) continue;
        img.data.set([220, 38, 38, 150], k * 4);
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  /* ── загрузка плана ── */
  function resetTo(p: PlanProject, image: string | null) {
    setProject(p); setBgUrl(image); setSelected(null); setDraft(null); setArmed(null);
    setTool(p.bg?.kind === "image" && p.bg.scale === null ? "scale" : "select");
    setFitKey(uid()); setError(null); setPdf(null);
  }
  function applyImage(im: PlanImage) {
    resetTo({ ...emptyProject(), std: project.std, profileId: PROFILES[project.std].id, all: project.all, targetM: project.targetM, bg: { kind: "image", wPx: im.wPx, hPx: im.hPx, scale: null } }, im.dataUrl);
  }
  async function onPlanFile(f: File | undefined) {
    if (!f) return;
    setError(null);
    if (f.size > PLAN_LIMITS.fileBytes) { setError(ui.errSize); return; }
    const kind = await sniff(f);
    if (kind !== "png" && kind !== "jpeg" && kind !== "pdf") { setError(ui.errType); return; }
    setBusy(true);
    try {
      if (kind === "pdf") {
        const doc = await openPdf(f).catch(() => null);
        if (!doc) { setError(ui.errPdf); return; }
        if (doc.numPages === 1) applyImage(await renderPdfPage(doc, 1));
        else setPdf({ doc, page: 1 });
      } else {
        applyImage(await loadRaster(f));
      }
    } catch {
      setError(kind === "pdf" ? ui.errPdf : ui.errImage);
    } finally {
      setBusy(false);
    }
  }
  async function openPdfPage() {
    if (!pdf) return;
    setBusy(true);
    try { applyImage(await renderPdfPage(pdf.doc, pdf.page)); } catch { setError(ui.errPdf); } finally { setBusy(false); }
  }
  async function onProjectFile(f: File | undefined) {
    if (!f) return;
    setError(null);
    if (f.size > PLAN_LIMITS.fileBytes * 1.5 || (await sniff(f)) !== "json") { setError(ui.errFile); return; }
    try {
      const o = JSON.parse((await f.text()).replace(/^﻿/, "")) as { format?: unknown; project?: unknown; image?: unknown };
      const pr = o?.format === FILE_FORMAT ? parseProject(o.project) : null;
      const image = o?.image ?? null;
      if (!pr || !(image === null || isPlanImageUrl(image)) || (pr.bg?.kind === "image") !== (image !== null)) { setError(ui.errFile); return; }
      if (pr.bg?.kind === "image" && image) {
        const im = await loadImage(image);
        if (im.naturalWidth !== pr.bg.wPx || im.naturalHeight !== pr.bg.hPx) { setError(ui.errFile); return; }
      }
      resetTo(pr, image as string | null);
    } catch {
      setError(ui.errFile);
    }
  }
  function startGrid() {
    if (!(gridW >= PLAN_LIMITS.sizeM[0] && gridW <= PLAN_LIMITS.sizeM[1] && gridH >= PLAN_LIMITS.sizeM[0] && gridH <= PLAN_LIMITS.sizeM[1])) return;
    resetTo({ ...emptyProject(), std: project.std, profileId: PROFILES[project.std].id, all: project.all, targetM: project.targetM, bg: { kind: "grid", wM: gridW, hM: gridH } }, null);
  }
  function newPlan() {
    if (!window.confirm(ui.confirmReset)) return;
    idbClear().catch(() => {});
    resetTo(emptyProject(), null);
  }

  /* ── камеры ── */
  const camLabel = useCallback((n: number) => fill(ui.camLabel, { n: String(n) }), [ui.camLabel]);
  const zoneLabel = useCallback((n: number) => fill(ui.zoneN, { n: String(n) }), [ui.zoneN]);
  const selCam = selected?.type === "cam" ? project.cams.find((c) => c.id === selected.id) ?? null : null;

  function placeCamera(x: number, y: number) {
    if (!armed || !bounds) return;
    if (project.cams.length >= PLAN_LIMITS.cams) { setError(fill(ui.limitCams, { n: String(PLAN_LIMITS.cams) })); return; }
    const cx = bounds.x + bounds.w / 2, cy = bounds.y + bounds.h / 2;
    const pan = Math.hypot(cx - x, cy - y) < 1e-6 ? 0 : (Math.atan2(cy - y, cx - x) * 180) / Math.PI;
    const aimD = Math.min(15, Math.max(3, 0.3 * Math.min(bounds.w, bounds.h)));
    const mountM = Math.max(3, project.targetM + 0.5);
    const cam: PlanCamera = {
      id: uid(), n: project.cams.reduce((m, c) => Math.max(m, c.n), 0) + 1,
      x, y, mountM, panDeg: Math.round(pan), tiltDeg: Math.round(tiltForAim(mountM, project.targetM, aimD) * 10) / 10,
      zoom: 0, vi: 0, spec: armed,
      // как в смете без плана: поворотная камера по умолчанию уличная (флажок в редакторе снимается)
      ...(armed.lensType === "ptz" ? { outdoor: true } : {}),
    };
    patch((p) => ({ ...p, cams: [...p.cams, cam] }));
    setSelected({ type: "cam", id: cam.id });
    setArmed(null);
    setTool("select");
  }
  const updateCam = (id: string, f: (c: PlanCamera) => PlanCamera) => patch((p) => ({ ...p, cams: p.cams.map((c) => (c.id === id ? f(c) : c)) }));
  function aimCam(id: string, x: number, y: number) {
    updateCam(id, (c) => {
      const d = Math.hypot(x - c.x, y - c.y);
      if (d < 1e-6) return c;
      const pan = (Math.atan2(y - c.y, x - c.x) * 180) / Math.PI;
      const tilt = Math.min(89, Math.max(0, tiltForAim(c.mountM, project.targetM, d)));
      return { ...c, panDeg: Math.round(pan * 10) / 10, tiltDeg: Math.round(tilt * 10) / 10 };
    });
  }
  function removeSelected() {
    if (!selected) return;
    if (selected.type === "cam") patch((p) => ({ ...p, cams: p.cams.filter((c) => c.id !== selected.id) }));
    if (selected.type === "wall") patch((p) => ({ ...p, walls: p.walls.filter((_, i) => i !== selected.i) }));
    if (selected.type === "zone") patch((p) => ({ ...p, zones: p.zones.filter((_, i) => i !== selected.i) }));
    setSelected(null);
  }
  function duplicateCam(c: PlanCamera) {
    if (project.cams.length >= PLAN_LIMITS.cams) { setError(fill(ui.limitCams, { n: String(PLAN_LIMITS.cams) })); return; }
    const b = bounds!;
    const copy: PlanCamera = { ...c, id: uid(), n: project.cams.reduce((m, x) => Math.max(m, x.n), 0) + 1, x: Math.min(b.x + b.w, c.x + 1), y: Math.min(b.y + b.h, c.y + 1) };
    patch((p) => ({ ...p, cams: [...p.cams, copy] }));
    setSelected({ type: "cam", id: copy.id });
  }

  /* ── черновики: стены, зоны, отрезок масштаба ── */
  function draftPoint(pt: Vec2) {
    setDraft((d) => {
      const kind = tool as "wall" | "zone" | "scale";
      const pts = d && d.kind === kind ? d.pts : [];
      if (kind === "scale") return { kind, pts: pts.length >= 2 ? [pt] : [...pts, pt], cursor: null };
      // двойной щелчок даёт два одинаковых щелчка — второй не добавляем
      if (pts.length && dist(pts[pts.length - 1], pt) < 1e-6) return d;
      if (kind === "zone" && pts.length >= PLAN_LIMITS.zonePoints) return d;
      return { kind, pts: [...pts, pt], cursor: d?.cursor ?? null };
    });
  }
  function finishDraft() {
    const d = draft;
    if (!d) return;
    if (d.kind === "wall" && d.pts.length >= 2) {
      const segs: Segment[] = d.pts.slice(1).map((q, i) => [d.pts[i], q]);
      patch((p) => ({ ...p, walls: [...p.walls, ...segs].slice(0, PLAN_LIMITS.walls) }));
    }
    if (d.kind === "zone" && d.pts.length >= 3 && project.zones.length < PLAN_LIMITS.zones) {
      patch((p) => ({ ...p, zones: [...p.zones, d.pts] }));
    }
    if (d.kind !== "scale") setDraft(null);
  }
  function applyScale() {
    const d = draft;
    const len = Number(scaleText.replace(",", "."));
    if (!d || d.kind !== "scale" || d.pts.length !== 2 || !(len > 0) || !(len <= 100000) || project.bg?.kind !== "image") { setError(ui.scaleBad); return; }
    const pxLen = dist(d.pts[0], d.pts[1]) / usedScale;
    if (!(pxLen > 1)) { setError(ui.scaleBad); return; }
    const scale = len / pxLen;
    const k = scale / usedScale;
    patch((p) => ({ ...rescaleProject(p, k), bg: p.bg?.kind === "image" ? { ...p.bg, scale } : p.bg }));
    setDraft(null); setError(null); setTool("select"); setFitKey(uid());
  }

  /* ── клавиатура ── */
  const active = useRef(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (!active.current) return;
      if (e.key === "Escape") { setDraft(null); setArmed(null); if (tool !== "select") setTool("select"); }
      else if (e.key === "Enter") finishDraft();
      else if ((e.key === "Delete" || e.key === "Backspace") && selected) { e.preventDefault(); removeSelected(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ── каталог ── */
  const [catalog, setCatalog] = useState<{ status: "idle" | "loading" | "ok" | "error"; list: PlanCatalogCamera[] }>({ status: "idle", list: [] });
  const [q, setQ] = useState("");
  useEffect(() => {
    if ((tool !== "camera" && !manualOn) || catalog.status !== "idle") return;
    setCatalog({ status: "loading", list: [] });
    fetch("/api/camera-designer/cameras").then((r) => (r.ok ? r.json() : Promise.reject())).then((j: { cameras: PlanCatalogCamera[] }) => setCatalog({ status: "ok", list: j.cameras }))
      .catch(() => setCatalog({ status: "error", list: [] }));
  }, [tool, catalog.status, manualOn]);
  const found = useMemo(() => {
    const s = norm(q);
    const list = s ? catalog.list.filter((c) => norm(`${c.brand}${c.model}`).includes(s) || norm(c.model).includes(s)) : catalog.list;
    return list.slice(0, 40);
  }, [q, catalog.list]);
  const specOf = (c: PlanCatalogCamera): CamSpec => ({
    source: "catalog", slug: c.slug, brand: c.brand, model: c.model, lensType: c.lensType, nx: c.nx, ny: c.ny,
    variants: c.variants.map((v) => ({ ...v })), ...(c.distortion ? { distortion: true } : {}), ...(c.kind === "analog" ? { analog: true } : {}),
  });

  const [cH, setCH] = useState(90);
  const [cV, setCV] = useState("");
  const [cRes, setCRes] = useState(1);
  function customSpec(h: number, v: number | null, nx: number, ny: number): CamSpec {
    return { source: "custom", model: ui.customName, lensType: "fixed", nx, ny, variants: [{ focalMm: null, hfovDeg: [h, h], vfovDeg: v ? [v, v] : null, status: "custom" }] };
  }
  function armCustom() {
    const v = cV.trim() ? Number(cV.replace(",", ".")) : null;
    if (!(cH >= 1 && cH <= 170) || (v !== null && !(v >= 1 && v <= 170))) return;
    const [nx, ny] = RES[cRes];
    setArmed(customSpec(cH, v, nx, ny));
  }
  const [calcMsg, setCalcMsg] = useState(false);
  function armFromCalc() {
    const inp = parseQuery(new URLSearchParams(window.location.search));
    const r = compute(inp);
    if (r.status !== "ok" || inp.lens === "fisheye") { setCalcMsg(true); return; }
    setCalcMsg(false);
    setArmed(customSpec(Math.round(r.hfovDeg * 10) / 10, Math.round(r.vfovDeg * 10) / 10, r.optics.nx, r.optics.ny));
  }

  /* ── таблица камер: цены из каталога ── */
  const slugs = useMemo(() => [...new Set(project.cams.map((c) => c.spec.slug).filter((s): s is string => !!s))].sort(), [project.cams]);
  const [info, setInfo] = useState<Record<string, PlanCameraInfo>>({});
  useEffect(() => {
    const need = slugs.filter((s) => !info[s]);
    if (!need.length) return;
    const t = setTimeout(() => {
      fetch(`/api/camera-designer/cameras?slugs=${encodeURIComponent(need.join(","))}&locale=${locale}`)
        .then((r) => (r.ok ? r.json() : Promise.reject())).then((j: { info: PlanCameraInfo[] }) => setInfo((m) => ({ ...m, ...Object.fromEntries(j.info.map((x) => [x.slug, x])) })))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [slugs, info, locale]);
  const rows = useMemo(() => {
    const m = new Map<string, { key: string; name: string; slug?: string; qty: number; price: string | null; priceNum: number | null }>();
    for (const c of project.cams) {
      const o = opticsAt(c.spec, c.vi, 0);
      const key = c.spec.slug ?? `custom:${o?.hfovDeg}:${c.spec.nx}x${c.spec.ny}`;
      const inf = c.spec.slug ? info[c.spec.slug] : undefined;
      const name = c.spec.source === "custom"
        ? fill(ui.customRow, { h: num(o?.hfovDeg ?? 0, 1), nx: String(c.spec.nx), ny: String(c.spec.ny) })
        : inf?.name ?? `${c.spec.brand ?? ""} ${c.spec.model}`.trim();
      const r = m.get(key) ?? { key, name, slug: c.spec.slug, qty: 0, price: inf?.price ?? null, priceNum: inf?.priceNum ?? null };
      r.qty++;
      m.set(key, r);
    }
    return [...m.values()];
  }, [project.cams, info, ui.customRow, num]);
  const total = rows.reduce((s, r) => s + (r.priceNum ? r.priceNum * r.qty : 0), 0);
  const allPriced = rows.length > 0 && rows.every((r) => r.priceNum);

  /* ── смета (этап D): камеры плана или ручной список ── */
  const [manual, setManual] = useState<ManualState | null>(null);
  useEffect(() => {
    idbLoad("manual").then((v) => {
      const o = v as Partial<ManualState> | undefined;
      if (!o || !Array.isArray(o.rows)) return;
      // строки — снимок из каталога; берём только корректные
      const rowsOk = o.rows.filter((r) => r && r.cam && typeof r.cam.slug === "string" && Number.isInteger(r.qty) && r.qty >= 1 && r.qty <= PLAN_LIMITS.cams && r.cam.nx > 0 && r.cam.ny > 0);
      setManual({ rows: rowsOk, mountM: Number(o.mountM) > 0 && Number(o.mountM) <= 100 ? Number(o.mountM) : 3, cableM: Number(o.cableM) > 0 && Number(o.cableM) <= 1000 ? Number(o.cableM) : DEFAULT_CABLE_M, est: parseEst(o.est) });
    }).catch(() => {});
  }, []);
  useEffect(() => {
    if (!manual) return;
    const t = setTimeout(() => { idbSave(manual, "manual").catch(() => setStorageWarn(true)); }, 800);
    return () => clearTimeout(t);
  }, [manual]);
  const man = manual ?? emptyManual();
  const setMan = (f: (m: ManualState) => ManualState) => setManual((m) => f(m ?? emptyManual()));
  // названия и цены камер ручного списка — тем же запросом, что и для камер плана
  const manualSlugs = useMemo(() => [...new Set(man.rows.map((r) => r.cam.slug))].sort().join(","), [man.rows]);
  useEffect(() => {
    const need = manualSlugs.split(",").filter((s) => s && !info[s]);
    if (!need.length) return;
    const t = setTimeout(() => {
      fetch(`/api/camera-designer/cameras?slugs=${encodeURIComponent(need.join(","))}&locale=${locale}`)
        .then((r) => (r.ok ? r.json() : Promise.reject())).then((j: { info: PlanCameraInfo[] }) => setInfo((m) => ({ ...m, ...Object.fromEntries(j.info.map((x) => [x.slug, x])) })))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [manualSlugs, info, locale]);

  const camKey = (c: PlanCamera) => c.spec.slug ?? `custom:${opticsAt(c.spec, c.vi, 0)?.hfovDeg}:${c.spec.nx}x${c.spec.ny}`;
  const estInputs = useMemo<EstInput[]>(() => {
    if (manualOn) {
      return man.rows.flatMap((r, i) => Array.from({ length: r.qty }, (): EstInput => ({
        key: r.cam.slug, slug: r.cam.slug, brand: r.cam.brand, nx: r.cam.nx, ny: r.cam.ny,
        kind: r.cam.kind === "analog" ? "analog" : r.cam.lensType === "ptz" ? "ptz" : "ip",
        outdoor: r.outdoor, mountM: man.mountM, cableM: man.cableM,
        label: `${i + 1}. ${r.cam.model}`, name: info[r.cam.slug]?.name ?? `${r.cam.brand} ${r.cam.model}`,
      })));
    }
    return [...project.cams].sort((a, b) => a.n - b.n).map((c): EstInput => ({
      key: camKey(c), slug: c.spec.slug, brand: c.spec.brand, nx: c.spec.nx, ny: c.spec.ny,
      kind: c.spec.analog ? "analog" : c.spec.lensType === "ptz" ? "ptz" : "ip",
      outdoor: !!c.outdoor, mountM: c.mountM,
      cableM: project.rack ? cableRun(c, project.rack) : DEFAULT_CABLE_M,
      label: camLabel(c.n),
      name: rows.find((r) => r.key === camKey(c))?.name ?? c.spec.model,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualOn, man, project.cams, project.rack, rows, info]);
  const camPrices = useMemo(() => {
    const out: Record<string, number | null> = {};
    for (const c of estInputs) out[c.key] = c.slug ? info[c.slug]?.priceNum ?? null : null;
    return out;
  }, [estInputs, info]);
  const [estView, setEstView] = useState<EstView | null>(null);
  const money = useCallback((v: string) => fill(ui.money, { v }), [ui.money]);
  const estSettings = manualOn ? man.est : project.est;
  const setEstSettings = (s: EstSettings) => (manualOn ? setMan((m) => ({ ...m, est: s })) : patch((p) => ({ ...p, est: s })));

  /* ── экспорт: картинка плана целиком ── */
  async function composeCanvas(): Promise<HTMLCanvasElement | null> {
    if (!bounds) return null;
    const B = bounds;
    const long = project.bg?.kind === "image" ? Math.max(project.bg.wPx, project.bg.hPx) : 2400;
    const W = Math.round(project.bg?.kind === "image" ? project.bg.wPx : (B.w / Math.max(B.w, B.h)) * long);
    const H = Math.round(project.bg?.kind === "image" ? project.bg.hPx : (B.h / Math.max(B.w, B.h)) * long);
    const f = Math.max(1, W / 1400); // крупность подписей легенды
    const fv = Math.max(1, W / 900); // крупность значков камер и подписей зон на картинке
    const foot = Math.round(70 * f);
    const c = document.createElement("canvas");
    c.width = W; c.height = H + foot;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    if (bgUrl && project.bg?.kind === "image") ctx.drawImage(await loadImage(bgUrl), 0, 0, W, H);
    if (calibrated) {
      // для картинки покрытие пересчитываем мельче экранного: растр экрана при растяжении даёт «ступеньки»
      const poses = project.cams.map(poseOf).filter((x): x is NonNullable<typeof x> => !!x);
      const r = analyze({ bounds: B, maxCells: Math.min(1_200_000, Math.round((W * H) / 3)), targetM: project.targetM, cams: poses, walls: project.walls, zones: project.zones, levelsPpm });
      ctx.globalAlpha = 0.62;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(paintHeat({ r, levels: levelsPpm, zones: project.zones, showOverlap: project.showOverlap, bounds: B }), 0, 0, (r.cols * r.cell / B.w) * W, (r.rows * r.cell / B.h) * H);
      ctx.globalAlpha = 1;
    }
    // векторы — тот же компонент, что на экране, с размерами под картинку
    const holder = document.createElement("div");
    const root = createRoot(holder);
    flushSync(() => root.render(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${B.x} ${B.y} ${B.w} ${B.h}`} width={W} height={H} fontFamily="Arial, Helvetica, sans-serif">
        {project.bg?.kind === "grid" ? (
          <g stroke="#e2e8f0" strokeWidth={1} vectorEffect="non-scaling-stroke">
            {Array.from({ length: Math.floor(B.w) + 1 }, (_, i) => <line key={`x${i}`} x1={i} y1={0} x2={i} y2={B.h} vectorEffect="non-scaling-stroke" />)}
            {Array.from({ length: Math.floor(B.h) + 1 }, (_, i) => <line key={`y${i}`} x1={0} y1={i} x2={B.w} y2={i} vectorEffect="non-scaling-stroke" />)}
          </g>
        ) : null}
        <PlanVectors project={project} bounds={B} k={(B.w / W) * fv} levelsPpm={levelsPpm} camLabel={camLabel} zoneLabel={zoneLabel} still />
      </svg>,
    ));
    const xml = holder.innerHTML;
    root.unmount();
    ctx.drawImage(await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`), 0, 0, W, H);
    // подвал: легенда и подпись
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, H, W, foot);
    ctx.font = `600 ${Math.round(13 * f)}px sans-serif`;
    ctx.textBaseline = "middle";
    let x = Math.round(14 * f);
    const y1 = H + foot * 0.33, y2 = H + foot * 0.72;
    const n = lv.length;
    [...lv].reverse().forEach((l, i) => {
      ctx.fillStyle = levelColor(i, n);
      ctx.fillRect(x, y1 - 7 * f, 18 * f, 14 * f);
      ctx.fillStyle = "#0f172a";
      const t = `${levels[l.code].name} ≥ ${num(l.ppm)}`;
      ctx.fillText(t, x + 24 * f, y1);
      x += 24 * f + ctx.measureText(t).width + 18 * f;
    });
    if (project.zones.length) {
      ctx.fillStyle = "rgba(220,38,38,0.6)";
      ctx.fillRect(x, y1 - 7 * f, 18 * f, 14 * f);
      ctx.fillStyle = "#0f172a";
      ctx.fillText(ui.uncovered, x + 24 * f, y1);
    }
    ctx.font = `${Math.round(12 * f)}px sans-serif`;
    ctx.fillStyle = "#475569";
    ctx.fillText(`SAT Solutions · satsolutions.uz · ${today()} · ${PROFILES[project.std].title} · ${ui.target}: ${num(project.targetM)} · ${ui.approx}`, 14 * f, y2);
    return c;
  }
  async function exportPng() {
    const c = await composeCanvas();
    c?.toBlob((b) => b && download(b, `sat-plan-${today()}.png`), "image/png");
  }
  function saveFile() {
    const body = JSON.stringify({ format: FILE_FORMAT, project: { ...project, updatedAt: new Date().toISOString() }, image: bgUrl });
    download(new Blob([body], { type: "application/json" }), `sat-plan-${today()}.satplan`);
  }
  const [printImg, setPrintImg] = useState<string | null>(null);
  const [printKind, setPrintKind] = useState<"plan" | "kp" | null>(null);
  async function printPlan() {
    const c = await composeCanvas();
    if (c) { setPrintKind("plan"); setPrintImg(c.toDataURL("image/jpeg", 0.92)); }
  }
  /** КП: та же печать браузером; картинка плана — если смета построена по плану. */
  async function printKp() {
    if (!estView) return;
    const c = !manualOn && calibrated ? await composeCanvas() : null;
    setPrintKind("kp");
    setPrintImg(c ? c.toDataURL("image/jpeg", 0.88) : "none");
  }
  const kpNo = useMemo(() => `SAT-CD-${today().replace(/-/g, "")}-${uid().slice(0, 4).toUpperCase()}`, [printImg]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!printImg) return;
    const done = () => { setPrintImg(null); setPrintKind(null); };
    window.addEventListener("afterprint", done, { once: true });
    const t = setTimeout(() => window.print(), 150);
    return () => { clearTimeout(t); window.removeEventListener("afterprint", done); };
  }, [printImg]);

  /* ── заявка ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attach, setAttach] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState<"" | "send" | "attach">("");

  function leadText(planUrl: string | null) {
    const ru = makeFmt("ru").num;
    const lines = [`🗺 Заявка с плана объекта (${locale})`, "", `Стандарт: ${PROFILES[project.std].title}, высота цели ${ru(project.targetM)} м`];
    lines.push(`Камеры (${project.cams.length}):`);
    for (const c of [...project.cams].sort((a, b) => a.n - b.n)) {
      const o = opticsAt(c.spec, c.vi, c.zoom);
      const lens = o?.focalMm ? `${ru(o.focalMm, 1)} мм` : `${ru(o?.hfovDeg ?? 0, 1)}°`;
      const nm = c.spec.source === "custom" ? `своя камера ${c.spec.nx}×${c.spec.ny}` : `${c.spec.brand ?? ""} ${c.spec.model}`.trim();
      lines.push(`К${c.n} · ${nm} · ${lens} · высота ${ru(c.mountM)} м, наклон ${ru(c.tiltDeg, 1)}°`);
    }
    if (rows.length) {
      lines.push("", "Сводка:");
      for (const r of rows) lines.push(`${r.slug ? r.slug : r.name} × ${r.qty}${r.slug ? ` — ${SITE}/products/${r.slug}` : ""}`);
    }
    if (result && project.zones.length) {
      lines.push("", "Зоны охраны:");
      result.r.zones.forEach((z, i) => {
        const parts = lv.map((l, j) => `${ruLevels[l.code]} ${Math.round(z.share[j] * 100)} %`);
        const none = Math.round((1 - (z.share[0] ?? 0)) * 100);
        lines.push(`Зона ${i + 1}: ${ru(z.areaM2, 0)} м² — ${parts.join(", ")}; не покрыто ${none} %; перекрытие ${Math.round(z.overlap * 100)} %`);
      });
    }
    if (project.walls.length) lines.push(`Стены: ${project.walls.length} отрезков`);
    if (planUrl) lines.push("", `План: ${planUrl}`);
    lines.push(...estimateText());
    return lines.join("\n");
  }

  /** Смета в тексте заявки — по-русски, её читает инженер в CRM. */
  function estimateText(): string[] {
    if (!estView) return [];
    const ru = makeFmt("ru").num;
    const r = estView.r;
    const out = ["", `Смета (архив ${estSettings.days} сут., ${estSettings.mode === "motion" ? "по движению" : "круглосуточно"}, ${estSettings.codec === "h264" ? "H.264" : "H.265"}; ${ru(r.storageTb, 1)} ТБ):`];
    // строки r.lines и estView.rows идут в одном порядке; slug — чтобы инженер нашёл товар в каталоге
    r.lines.forEach((l, i) => {
      const nm = estView.rows[i]?.name ?? l.kind;
      out.push(`${nm}${l.slug ? ` [${l.slug}]` : ""} × ${l.qty}${l.sum !== null ? ` = ${ru(l.sum, 0)}` : estView.rows[i]?.engineer ? " — подберёт инженер" : " — по запросу"}`);
    });
    out.push(`Оборудование: ${ru(r.totals.equipment, 0)} сум; работы ${ru(r.totals.laborLow, 0)}–${ru(r.totals.laborHigh, 0)} сум`);
    if (r.warnings.length) out.push(`Предупреждения: ${r.warnings.map((w) => w.code).join(", ")}`);
    return out;
  }

  function manualLeadText() {
    const ru = makeFmt("ru").num;
    const lines = [`🧾 Заявка: смета без плана (${locale})`, "", `Камеры (${estInputs.length}), высота ${ru(man.mountM)} м, кабель в среднем ${ru(man.cableM)} м:`];
    for (const r of man.rows) lines.push(`${r.cam.brand} ${r.cam.model} × ${r.qty}${r.outdoor ? " (улица)" : ""} — ${SITE}/products/${r.cam.slug}`);
    lines.push(...estimateText());
    return lines.join("\n");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSending(true); setFailed("");
    let planUrl: string | null = null;
    if (attach && !manualOn) {
      try {
        const c = await composeCanvas();
        let blob = c ? await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85)) : null;
        if (blob && blob.size > 18 * 1024 * 1024 && c) blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.6));
        if (!blob) throw new Error("blob");
        const fd = new FormData();
        fd.append("kind", "file");
        fd.append("file", blob, `plan-${today()}.jpg`);
        const u = await fetch("https://api.satsolutions.uz/chat/upload-file", { method: "POST", body: fd });
        const j = await u.json().catch(() => null);
        if (!u.ok || typeof j?.attachment?.url !== "string") throw new Error("upload");
        planUrl = j.attachment.url;
      } catch {
        setFailed("attach"); setSending(false);
        return;
      }
    }
    try {
      const res = await fetch("https://api.satsolutions.uz/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "Гость", phone, message: manualOn ? manualLeadText() : leadText(planUrl), gclid: getGclid() || undefined }),
      });
      if (!res.ok) throw new Error("bad status");
      setSent(true);
      const ph = phone.startsWith("+") ? phone : `+998${phone.replace(/\D/g, "").slice(-9)}`;
      trackConversion("lead", { user: { phone: ph }, placement: manualOn ? "camera_estimate" : "camera_planner" });
    } catch {
      setFailed("send");
    }
    setSending(false);
  }

  /* ── разметка ── */
  const pct = (v: number) => `${Math.round(v * 100)} %`;
  const zonesRes = result?.r.zones ?? [];
  if (!restored) return <div className={`${card} text-sm text-slate-500`}>{ui.loading}</div>;

  const hint = !calibrated && project.bg ? ui.hint.scaleNeeded
    : tool === "rack" ? est.rackHint
    : tool === "camera" ? (armed ? ui.hint.place : ui.hint.pick)
    : tool === "wall" ? ui.hint.wall : tool === "zone" ? ui.hint.zone : tool === "scale" ? ui.hint.scale : ui.hint.select;

  if ((!project.bg || !bounds) && manualOn) {
    const totalQty = man.rows.reduce((a, r) => a + r.qty, 0);
    const addRow = (c: PlanCatalogCamera) => {
      if (totalQty >= PLAN_LIMITS.cams) { setError(fill(ui.limitCams, { n: String(PLAN_LIMITS.cams) })); return; }
      setMan((m) => {
        const i = m.rows.findIndex((r) => r.cam.slug === c.slug);
        if (i >= 0) return { ...m, rows: m.rows.map((r, j) => (j === i ? { ...r, qty: r.qty + 1 } : r)) };
        return { ...m, rows: [...m.rows, { cam: c, qty: 1, outdoor: c.lensType === "ptz" }] };
      });
    };
    return (
      <div className="space-y-4" onPointerEnter={() => { active.current = true; }}>
        <div className={card}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-black text-slate-900">{est.manualTitle}</h2>
            <button type="button" className={btnCls} onClick={() => setManualOn(false)}>← {est.backToPlan}</button>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{est.manualHint}</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <div>
              <input type="search" className={inputCls} placeholder={ui.search} value={q} onChange={(e) => setQ(e.target.value)} aria-label={ui.search} />
              <div className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1">
                {catalog.status === "loading" ? <p className="text-xs text-slate-500">{ui.loadingList}</p> : null}
                {catalog.status === "error" ? <p className="text-xs text-amber-700">{ui.listError}</p> : null}
                {catalog.status === "ok" && !found.length ? <p className="text-xs text-slate-500">{ui.searchEmpty}</p> : null}
                {found.map((c) => (
                  <div key={c.slug} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-xs">
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-slate-900">{c.brand} {c.model}</span>
                      <span className="block text-[11px] text-slate-500">{ui.lens[c.lensType]} · {num((c.nx * c.ny) / 1e6, 1)} MP{c.status === "needs_review" ? ` · ${ui.review}` : ""}</span>
                    </span>
                    <button type="button" className={btnCls} onClick={() => addRow(c)}>{est.manualAdd}</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {man.rows.length ? (
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-slate-200 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500"><th className="py-1.5 pr-2">{ui.colModel}</th><th className="py-1.5 pr-2">{est.qty}</th><th className="py-1.5 pr-2">{est.outdoor}</th><th /></tr></thead>
                  <tbody>
                    {man.rows.map((r, i) => (
                      <tr key={r.cam.slug} className="border-b border-slate-100 last:border-0">
                        <td className="py-1.5 pr-2 font-semibold text-slate-800">{info[r.cam.slug]?.name ?? `${r.cam.brand} ${r.cam.model}`}</td>
                        <td className="py-1.5 pr-2">
                          <input type="number" min={1} max={PLAN_LIMITS.cams} value={r.qty} aria-label={est.qty} className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 tabular-nums"
                            onChange={(e) => { const v = Math.round(Number(e.target.value)); if (v >= 1 && totalQty - r.qty + v <= PLAN_LIMITS.cams) setMan((m) => ({ ...m, rows: m.rows.map((x, j) => (j === i ? { ...x, qty: v } : x)) })); }} />
                        </td>
                        <td className="py-1.5 pr-2"><input type="checkbox" checked={r.outdoor} aria-label={est.outdoor} className="h-4 w-4 accent-brand-600" onChange={(e) => setMan((m) => ({ ...m, rows: m.rows.map((x, j) => (j === i ? { ...x, outdoor: e.target.checked } : x)) }))} /></td>
                        <td className="py-1.5 text-right"><button type="button" className="text-[11px] font-semibold text-red-600 hover:underline" onClick={() => setMan((m) => ({ ...m, rows: m.rows.filter((_, j) => j !== i) }))}>{est.remove}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-xs text-slate-500">{est.empty}</p>}
              <p className="mt-2 text-[11px] text-slate-500">{est.outdoorHint}</p>
            </div>
          </div>
          {error ? <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
        </div>
        {estimateBlock()}
        <div className="max-w-md">{leadBlock()}</div>
        {printBlock()}
      </div>
    );
  }

  if (!project.bg || !bounds) {
    return (
      <div className={card} onPointerEnter={() => { active.current = true; }}>
        <h2 className="text-base font-black text-slate-900">{ui.startTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{ui.startText}</p>
        <p className="mt-3 max-w-3xl rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-relaxed text-emerald-900">{ui.privacy}</p>
        {pdf ? (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="cp-pdf" className="mb-1 block text-xs font-semibold text-slate-600">{fill(ui.pdfPage, { n: String(pdf.page), t: String(pdf.doc.numPages) })}</label>
              <select id="cp-pdf" className={inputCls} value={pdf.page} onChange={(e) => setPdf({ ...pdf, page: Number(e.target.value) })}>
                {Array.from({ length: Math.min(pdf.doc.numPages, 200) }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
            </div>
            <button type="button" className={primaryCls} disabled={busy} onClick={openPdfPage}>{busy ? ui.loading : ui.pdfOpen}</button>
            <button type="button" className={btnCls} onClick={() => setPdf(null)}>{ui.cancel}</button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <button type="button" className={`${primaryCls} w-full`} disabled={busy} onClick={() => fileInput.current?.click()}>{busy ? ui.loading : ui.upload}</button>
              <p className="mt-2 text-center text-[11px] text-slate-500">{ui.uploadHint}</p>
              <input ref={fileInput} type="file" className="sr-only" accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                onChange={(e) => { onPlanFile(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="grid grid-cols-2 gap-2">
                <Num id="cp-gw" label={ui.gridW} value={gridW} min={1} max={5000} dec={dec} onChange={setGridW} />
                <Num id="cp-gh" label={ui.gridH} value={gridH} min={1} max={5000} dec={dec} onChange={setGridH} />
              </div>
              <button type="button" className={`${btnCls} mt-2 w-full`} onClick={startGrid}>{ui.gridCreate}</button>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <button type="button" className={`${btnCls} w-full`} onClick={() => projInput.current?.click()}>{ui.openFile}</button>
              <input ref={projInput} type="file" className="sr-only" accept=".satplan,application/json"
                onChange={(e) => { onProjectFile(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <button type="button" className={`${btnCls} w-full`} onClick={() => { setManualOn(true); setError(null); }}>{est.manualStart}</button>
              <p className="mt-2 text-center text-[11px] text-slate-500">{est.manualHint}</p>
            </div>
          </div>
        )}
        {error ? <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
      </div>
    );
  }

  const toolBtn = (t: Tool, label: string, disabled = false) => (
    <button key={t} type="button" aria-pressed={tool === t} disabled={disabled}
      onClick={() => { setTool(t); setDraft(null); if (t !== "camera") setArmed(null); }}
      className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-40 ${tool === t ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"}`}>
      {label}
    </button>
  );
  return (
    <div className="space-y-4" onPointerEnter={() => { active.current = true; }} onPointerLeave={() => { active.current = false; }} onFocus={() => { active.current = true; }}>
      {/* панель инструментов */}
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" className="flex flex-wrap gap-1.5">
          {toolBtn("select", ui.tools.select)}
          {toolBtn("camera", ui.tools.camera, !calibrated)}
          {toolBtn("wall", ui.tools.wall)}
          {toolBtn("zone", ui.tools.zone)}
          {project.bg.kind === "image" ? toolBtn("scale", ui.tools.scale) : null}
          {toolBtn("rack", est.rackTool, !calibrated)}
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5">
          <button type="button" className={btnCls} onClick={saveFile}>{ui.save}</button>
          <button type="button" className={btnCls} disabled={!calibrated} onClick={exportPng}>{ui.png}</button>
          <button type="button" className={btnCls} disabled={!calibrated} onClick={printPlan}>{ui.print}</button>
          <button type="button" className={btnCls} onClick={newPlan}>{ui.reset}</button>
        </div>
      </div>
      <p className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${!calibrated ? "bg-amber-50 font-semibold text-amber-900" : "bg-slate-100 text-slate-600"}`} aria-live="polite">{hint}</p>
      {error ? <p role="alert" className="text-sm font-semibold text-red-600">{error}</p> : null}
      {storageWarn ? <p role="alert" className="text-xs font-semibold text-amber-700">{ui.errStorage}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative min-w-0">
          {/* «Готово / Отмена» — поверх полотна: кнопки в панели сдвигали бы план между щелчками */}
          {draft && draft.kind !== "scale" ? (
            <div className="absolute left-2 top-2 z-10 flex gap-1.5">
              <button type="button" className={`${btnCls} shadow-sm`} onClick={finishDraft}>{ui.finish}</button>
              <button type="button" className={`${btnCls} shadow-sm`} onClick={() => setDraft(null)}>{ui.cancel}</button>
            </div>
          ) : null}
          <PlanCanvas
            project={project} bounds={bounds} bgUrl={bgUrl} heatUrl={heatUrl} heatBounds={result?.bounds ?? null}
            tool={tool} armed={!!armed} selected={selected} draft={draft} levelsPpm={levelsPpm}
            camLabel={camLabel} zoneLabel={zoneLabel}
            labels={{ zoomIn: ui.zoomIn, zoomOut: ui.zoomOut, fit: ui.fit, m: ui.units.m, dec }} fitKey={fitKey}
            onSelect={setSelected}
            onMoveCam={(id, x, y) => updateCam(id, (c) => ({ ...c, x, y }))}
            onAim={aimCam} onPlace={placeCamera}
            onDraftPoint={draftPoint} onDraftCursor={(pt) => setDraft((d) => (d ? { ...d, cursor: pt } : tool === "wall" || tool === "zone" || tool === "scale" ? null : d))}
            onDraftFinish={finishDraft} onDragging={setDragging}
            onRack={(x, y) => { patch((p) => ({ ...p, rack: { x, y } })); setTool("select"); }}
          />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500"><b>{ui.approx}.</b> {ui.disclaimer}</p>
        </div>

        <div className="space-y-4">
          {/* контекстная панель */}
          {tool === "scale" ? (
            <div className={card}>
              <div className={h3}>{ui.tools.scale}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{ui.hint.scale}</p>
              <div className="mt-3 flex items-end gap-2">
                <div className="flex-1">
                  <label htmlFor="cp-sl" className="mb-1 block text-xs font-semibold text-slate-600">{ui.scaleLen}</label>
                  <input id="cp-sl" className={inputCls} inputMode="decimal" value={scaleText} onChange={(e) => setScaleText(e.target.value)} />
                </div>
                <button type="button" className={primaryCls} disabled={draft?.kind !== "scale" || draft.pts.length !== 2} onClick={applyScale}>{ui.scaleApply}</button>
              </div>
              {project.bg.kind === "image" && project.bg.scale ? <p className="mt-2 text-[11px] text-slate-500">{fill(ui.scaleNow, { px: num(1 / project.bg.scale, 1) })}</p> : null}
            </div>
          ) : null}

          {tool === "camera" ? (
            <div className={card}>
              <div className={h3}>{ui.tools.camera}</div>
              {armed ? <p className="mt-1 rounded-lg bg-brand-50 px-2 py-1.5 text-xs font-semibold text-brand-800">{armed.source === "custom" ? ui.customName : `${armed.brand ?? ""} ${armed.model}`} — {ui.hint.place}</p> : null}
              <input type="search" className={`${inputCls} mt-2`} placeholder={ui.search} value={q} onChange={(e) => setQ(e.target.value)} aria-label={ui.search} />
              <div className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1">
                {catalog.status === "loading" ? <p className="text-xs text-slate-500">{ui.loadingList}</p> : null}
                {catalog.status === "error" ? <p className="text-xs text-amber-700">{ui.listError}</p> : null}
                {catalog.status === "ok" && !found.length ? <p className="text-xs text-slate-500">{ui.searchEmpty}</p> : null}
                {found.map((c) => (
                  <button key={c.slug} type="button" onClick={() => setArmed(specOf(c))}
                    className={`block w-full rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${armed?.slug === c.slug ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-brand-300"}`}>
                    <span className="font-bold text-slate-900">{c.brand} {c.model}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-500">
                      {ui.lens[c.lensType]} · {num((c.nx * c.ny) / 1e6, 1)} MP · {c.variants.map((v) => (v.focalMm ? (v.focalMm[0] === v.focalMm[1] ? `${num(v.focalMm[0], 1)}` : `${num(v.focalMm[0], 1)}–${num(v.focalMm[1], 1)}`) : `${num(v.hfovDeg[0], 0)}°`)).join(" / ")}{c.variants[0].focalMm ? ` ${ui.units.mm}` : ""}
                      {c.status === "needs_review" ? <span className="ml-1 font-semibold text-amber-700" title={ui.reviewHint}>· {ui.review}</span> : null}
                      {c.kind === "analog" ? <span className="ml-1">· {ui.analog}</span> : null}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="text-xs font-black text-slate-800">{ui.customTitle}</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Num id="cp-ch" label={ui.customH} value={cH} min={1} max={170} dec={dec} onChange={setCH} />
                  <div>
                    <label htmlFor="cp-cv" className="mb-1 block text-xs font-semibold text-slate-600">{ui.customV}</label>
                    <input id="cp-cv" className={inputCls} inputMode="decimal" value={cV} onChange={(e) => setCV(e.target.value)} />
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{ui.customVHint}</p>
                <label htmlFor="cp-cr" className="mb-1 mt-2 block text-xs font-semibold text-slate-600">{ui.customRes}</label>
                <select id="cp-cr" className={inputCls} value={cRes} onChange={(e) => setCRes(Number(e.target.value))}>
                  {RES.map(([w, h], i) => <option key={i} value={i}>{w}×{h} ({num((w * h) / 1e6, 1)} MP)</option>)}
                </select>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button type="button" className={btnCls} onClick={armCustom}>{ui.customAdd}</button>
                  <button type="button" className={btnCls} onClick={armFromCalc}>{ui.fromCalc}</button>
                </div>
                {calcMsg ? <p className="mt-1 text-[11px] text-amber-700">{ui.fromCalcNone}</p> : null}
              </div>
            </div>
          ) : null}

          {/* вызов функцией, а не <CamEditor/>: вложенный компонент пересоздавался бы на каждом
              рендере, и поля ввода теряли бы фокус после каждого символа */}
          {tool === "select" && selCam ? camEditor(selCam) : null}

          {tool === "select" && (selected?.type === "wall" || selected?.type === "zone") ? (
            <div className={card}>
              <div className={h3}>{selected.type === "wall" ? ui.wallsTitle : zoneLabel(selected.i + 1)}</div>
              <button type="button" className={`${btnCls} mt-2`} onClick={removeSelected}>{selected.type === "wall" ? ui.remove : ui.removeZone}</button>
            </div>
          ) : null}

          {tool === "wall" && project.walls.length ? (
            <div className={card}>
              <div className={h3}>{ui.wallsTitle}</div>
              <p className="mt-1 text-xs text-slate-600">{fill(ui.wallsCount, { n: String(project.walls.length) })}</p>
              <button type="button" className={`${btnCls} mt-2`} onClick={() => patch((p) => ({ ...p, walls: [] }))}>{ui.clearWalls}</button>
            </div>
          ) : null}

          {/* настройки */}
          <div className={card}>
            <div className={h3}>{ui.settings}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["2014", "2025"] as const).map((k) => (
                <button key={k} type="button" aria-pressed={project.std === k}
                  onClick={() => patch((p) => ({ ...p, std: k, profileId: PROFILES[k].id }))}
                  className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold ${project.std === k ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700"}`}>
                  {k === "2014" ? ui.std2014 : ui.std2025}
                </button>
              ))}
            </div>
            {project.std === "2014" ? (
              <label className="mt-2 flex items-center gap-2 text-xs text-slate-700">
                <input type="checkbox" checked={project.all} onChange={(e) => patch((p) => ({ ...p, all: e.target.checked }))} className="h-4 w-4 accent-brand-600" />
                {ui.allLevels}
              </label>
            ) : null}
            <div className="mt-3">
              <Num id="cp-t" label={ui.target} value={project.targetM} min={0} max={3} dec={dec} hint={ui.targetHint}
                onChange={(v) => patch((p) => ({ ...p, targetM: v }))} />
            </div>
            <label className="mt-2 flex items-center gap-2 text-xs text-slate-700">
              <input type="checkbox" checked={project.showOverlap} onChange={(e) => patch((p) => ({ ...p, showOverlap: e.target.checked }))} className="h-4 w-4 accent-brand-600" />
              {ui.overlap}
            </label>
          </div>

          {/* легенда и покрытие */}
          <div className={card}>
            <div className={h3}>{ui.legend}</div>
            <ul className="mt-2 space-y-1">
              {[...lv].reverse().map((l, i) => (
                <li key={l.code} className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="h-3.5 w-5 shrink-0 rounded-sm" style={{ background: levelColor(i, lv.length), opacity: 0.8 }} />
                  {levels[l.code].name} <span className="text-slate-400">≥ {num(l.ppm)} {ui.units.px}/{ui.units.m}</span>
                </li>
              ))}
              <li className="flex items-center gap-2 text-xs text-slate-700"><span className="h-3.5 w-5 shrink-0 rounded-sm bg-red-600/60" />{ui.uncovered}</li>
              {project.showOverlap ? <li className="flex items-center gap-2 text-xs text-slate-700"><span className="h-3.5 w-5 shrink-0 rounded-sm" style={{ background: "repeating-linear-gradient(45deg,#1d6a7d 0 3px,#0b2a33 3px 5px)" }} />{ui.overlapLegend}</li> : null}
            </ul>
            {!project.cams.length ? <p className="mt-2 text-xs text-slate-500">{ui.noCams}</p> : null}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="text-xs font-black text-slate-800">{ui.coverTitle}</div>
              {!project.zones.length ? <p className="mt-1 text-xs text-slate-500">{ui.coverEmpty}</p> : null}
              {zonesRes.map((z, i) => (
                <div key={i} className="mt-2 rounded-lg bg-slate-50 p-2.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900">{zoneLabel(i + 1)}</span>
                    <span className="text-slate-500">{fill(ui.coverArea, { a: num(z.areaM2, 0) })}</span>
                  </div>
                  <table className="mt-1 w-full text-xs">
                    <tbody>
                      {[...lv].map((l, j) => ({ l, j })).reverse().map(({ l, j }) => (
                        <tr key={l.code}>
                          <td className="py-0.5 pr-2 text-slate-600">{levels[l.code].name}</td>
                          <td className="py-0.5 text-right font-semibold tabular-nums text-slate-900">{pct(z.share[j])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-1 text-[11px] text-slate-500">{fill(ui.coverNone, { p: pct(1 - (z.share[0] ?? 0)) })} · {fill(ui.coverOverlap, { p: pct(z.overlap) })}</p>
                </div>
              ))}
            </div>
          </div>

          {/* камеры и цены */}
          {rows.length ? (
            <div className={card}>
              <div className={h3}>{ui.tableTitle}</div>
              <table className="mt-2 w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    <th className="py-1.5 pr-2">{ui.colModel}</th><th className="py-1.5 pr-2 text-right">{ui.colQty}</th><th className="py-1.5 text-right">{ui.colSum}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.key} className="border-b border-slate-100 align-top last:border-0">
                      <td className="py-1.5 pr-2">
                        {r.slug ? <a href={`${locale === "ru" ? "" : `/${locale}`}/products/${r.slug}`} target="_blank" rel="noopener" className="font-semibold text-brand-700 hover:underline">{r.name}</a> : <span className="font-semibold text-slate-800">{r.name}</span>}
                        {/* цена за штуку — в формате языка страницы, как сумма рядом (строка API отформатирована по-русски) */}
                        <span className="block text-[11px] text-slate-500">{r.priceNum ? fill(ui.money, { v: num(r.priceNum, 0) }) : r.price ? fill(ui.money, { v: r.price }) : r.slug ? ui.onRequest : ""}</span>
                      </td>
                      <td className="py-1.5 pr-2 text-right tabular-nums">{r.qty}</td>
                      <td className="py-1.5 text-right tabular-nums">{r.priceNum ? num(r.priceNum * r.qty, 0) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {total > 0 ? <p className="mt-2 text-right text-xs font-black text-slate-900">{ui.total}: {allPriced ? "" : "≥ "}{fill(ui.money, { v: num(total, 0) })}</p> : null}
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{ui.tableNote} <a href={`${locale === "ru" ? "" : `/${locale}`}/calculator`} className="font-semibold text-brand-700 hover:underline">{ui.installLink} →</a></p>
            </div>
          ) : null}

          {leadBlock()}
        </div>
      </div>

      {estimateBlock()}
      {printBlock()}
    </div>
  );

  /* ── смета под планом / в ручном режиме ── */
  function estimateBlock() {
    const cableNote = manualOn ? (
      <div className="grid max-w-md grid-cols-2 gap-2">
        <Num id="em-m" label={est.mountAvg} value={man.mountM} min={0.3} max={100} dec={dec} onChange={(v) => setMan((m) => ({ ...m, mountM: v }))} />
        <Num id="em-c" label={est.cableAvg} value={man.cableM} min={1} max={1000} dec={dec} onChange={(v) => setMan((m) => ({ ...m, cableM: v }))} />
      </div>
    ) : (
      <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
        {project.rack ? est.rackHint : fill(est.rackNone, { m: String(DEFAULT_CABLE_M) })}{" "}
        {!project.rack && calibrated ? <button type="button" className="font-semibold text-brand-700 hover:underline" onClick={() => setTool("rack")}>{est.rackTool} →</button> : null}
      </p>
    );
    return (
      <EstimatePanel ui={est} locale={locale} cams={estInputs} camPrices={camPrices} settings={estSettings} onSettings={setEstSettings}
        money={money} cableNote={cableNote} onView={setEstView} onKp={printKp} />
    );
  }

  /* ── заявка ── */
  function leadBlock() {
    return (
      <div className={card}>
        <div className={h3}>{ui.leadTitle}</div>
        {sent ? (
          <div className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"><b>{ui.sentTitle}.</b> {ui.sentText}</div>
        ) : (
          <form onSubmit={submit} className="mt-2 space-y-2">
            <p className="text-xs leading-relaxed text-slate-600">{ui.leadText}</p>
            <div>
              <label htmlFor="cp-n" className="mb-1 block text-xs font-semibold text-slate-600">{ui.name}</label>
              <input id="cp-n" className={inputCls} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div>
              <label htmlFor="cp-p" className="mb-1 block text-xs font-semibold text-slate-600">{ui.phone}</label>
              <input id="cp-p" className={inputCls} type="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
            </div>
            {!manualOn ? (
              <label className="flex items-start gap-2 text-xs text-slate-700">
                <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-600" />
                <span>{ui.attach}<span className="block text-[11px] text-slate-500">{ui.attachHint}</span></span>
              </label>
            ) : null}
            <button type="submit" className={`${primaryCls} w-full`} disabled={sending || !phone.trim()}>{sending ? ui.sending : ui.send}</button>
            {failed ? <p role="alert" className="text-xs font-semibold text-red-600">{failed === "attach" ? ui.attachFailed : ui.failed}</p> : null}
          </form>
        )}
      </div>
    );
  }

  /* ── печать: план или коммерческое предложение ──
     Лист выносится прямо в body и печатается один: остальное скрыто display:none. Прежний
     visibility:hidden оставлял высоту страницы — «Сохранить как PDF» давал 7 пустых листов в конце. */
  function printBlock() {
    if (!printImg) return null;
    return createPortal(
      <>
        <style>{"@media print{body>*:not(#cd-print){display:none!important}#cd-print{display:block!important}}"}</style>
        {printKind === "kp" && estView ? (
          <div id="cd-print" className="hidden bg-white p-4 text-black">
            <KpSheet ui={est} locale={locale} view={estView} no={kpNo} date={kpDate(locale, today())} planImg={printImg === "none" ? null : printImg}
              cams={manualOn ? [] : estInputs.map((c) => ({ label: c.label, name: c.name }))} money={money} />
          </div>
        ) : (
          <div id="cd-print" className="hidden bg-white p-4 text-black">
            <h1 className="text-xl font-black">{ui.printTitle}</h1>
            <p className="text-xs">SAT Solutions · satsolutions.uz · {fill(ui.printDate, { d: today() })}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={printImg} alt="" className="mt-3 w-full" />
            {zonesRes.length ? (
              <div className="mt-3 text-xs">
                <b>{ui.coverTitle}</b>
                {zonesRes.map((z, i) => (
                  <p key={i}>{zoneLabel(i + 1)} ({fill(ui.coverArea, { a: num(z.areaM2, 0) })}): {[...lv].map((l, j) => `${levels[l.code].name} ${pct(z.share[j])}`).reverse().join(" · ")}</p>
                ))}
              </div>
            ) : null}
            {rows.length ? (
              <div className="mt-3 text-xs">
                <b>{ui.tableTitle}</b>
                {rows.map((r) => <p key={r.key}>{r.name} × {r.qty}{r.priceNum ? ` — ${num(r.priceNum * r.qty, 0)}` : ""}</p>)}
              </div>
            ) : null}
            <p className="mt-3 text-[10px]">{fill(ui.printMethod, { p: PROFILES[project.std].title, e: ENGINE_VERSION, t: num(project.targetM) })}</p>
            <p className="mt-1 text-[10px]">{ui.disclaimer}</p>
          </div>
        )}
      </>,
      document.body,
    );
  }

  /* ── редактор выбранной камеры ── */
  function camEditor(c: PlanCamera) {
    const o = opticsAt(c.spec, c.vi, c.zoom);
    const pose = poseOf(c);
    const fr = pose ? frameOf(pose, project.targetM) : null;
    const v = c.spec.variants[c.vi];
    const zoom = v && isZoom(v);
    const oo = o ? opticsFromFov({ hfovDeg: o.hfovDeg, vfovDeg: o.vfovDeg, nx: c.spec.nx, ny: c.spec.ny }) : null;
    const g = oo && c.mountM > project.targetM ? sideGeometry(oo, { mountM: c.mountM, targetM: project.targetM, tiltDeg: Math.min(89, c.tiltDeg) }) : null;
    const review = c.spec.variants.some((x) => x.status === "needs_review");
    return (
      <div key={c.id} className={card}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className={h3}>{camLabel(c.n)} · {c.spec.source === "custom" ? ui.customName : `${c.spec.brand ?? ""} ${c.spec.model}`}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">
              {ui.lens[c.spec.lensType]} · {c.spec.nx}×{c.spec.ny}
              {c.spec.source === "catalog" ? <span className={review ? "ml-1 font-semibold text-amber-700" : "ml-1 text-emerald-700"}>· {review ? ui.review : ui.verified}</span> : null}
            </div>
          </div>
        </div>
        {c.spec.variants.length > 1 ? (
          <div className="mt-2">
            <label htmlFor="cp-vi" className="mb-1 block text-xs font-semibold text-slate-600">{ui.variant}</label>
            <select id="cp-vi" className={inputCls} value={c.vi} onChange={(e) => updateCam(c.id, (x) => ({ ...x, vi: Number(e.target.value), zoom: 0 }))}>
              {c.spec.variants.map((x, i) => <option key={i} value={i}>{x.focalMm ? `${num(x.focalMm[0], 1)}${x.focalMm[0] !== x.focalMm[1] ? `–${num(x.focalMm[1], 1)}` : ""} ${ui.units.mm}` : `${num(x.hfovDeg[0], 0)}°`}</option>)}
            </select>
          </div>
        ) : null}
        {zoom ? (
          <div className="mt-2">
            <label htmlFor="cp-z" className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
              <span>{ui.zoom}</span>
              <span className="tabular-nums text-slate-800">{o?.focalMm ? fill(o.estimate && c.zoom > 0 && c.zoom < 1 ? ui.focalEst : ui.focal, { f: num(o.focalMm, 1) }) : `${num(o?.hfovDeg ?? 0, 1)}°`}</span>
            </label>
            <input id="cp-z" type="range" min={0} max={1} step={0.005} value={c.zoom} className="h-6 w-full cursor-pointer accent-brand-600"
              onChange={(e) => updateCam(c.id, (x) => ({ ...x, zoom: Number(e.target.value) }))} />
          </div>
        ) : null}
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Num id="cp-m" label={ui.mount} value={c.mountM} min={PLAN_LIMITS.mountM[0]} max={PLAN_LIMITS.mountM[1]} dec={dec} onChange={(val) => updateCam(c.id, (x) => ({ ...x, mountM: val }))} />
          <Num id="cp-tl" label={ui.tilt} value={c.tiltDeg} min={0} max={89} dec={dec} onChange={(val) => updateCam(c.id, (x) => ({ ...x, tiltDeg: val }))} />
          <Num id="cp-pn" label={ui.pan} value={((c.panDeg % 360) + 360) % 360} min={0} max={360} dec={dec} onChange={(val) => updateCam(c.id, (x) => ({ ...x, panDeg: val }))} />
        </div>
        <p className="mt-1 text-[11px] leading-snug text-slate-500">{ui.aimHint}</p>
        {!fr ? <p className="mt-2 text-xs font-semibold text-red-600">{ui.belowTarget}</p> : null}
        {o && fr ? (
          <div className="mt-2 space-y-0.5 text-xs text-slate-700">
            <p>{fill(ui.fov, { h: num(o.hfovDeg, 1), v: num(o.vfovDeg, 1) })}</p>
            <p>{fill(ui.blind, { d: num(blindRadius(fr), 1) })}</p>
            {oo && g ? (
              <div className="mt-1.5">
                <div className="text-[11px] font-semibold text-slate-500">{ui.levelsTitle}</div>
                <table className="w-full">
                  <tbody>
                    {[...lv].reverse().map((l) => {
                      const r = groundRangeForPpm(oo, g, l.ppm);
                      return (
                        <tr key={l.code}>
                          <td className="py-0.5 pr-2">{levels[l.code].name}</td>
                          <td className="py-0.5 text-right tabular-nums">{r ? fill(ui.levelUpTo, { d: num(r.toM, 1) }) : ui.levelNone}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        ) : null}
        {zoom && c.zoom > 0 && c.zoom < 1 ? <p className="mt-2 text-[11px] text-slate-500">{ui.estimate}</p> : null}
        {c.spec.distortion ? <p className="mt-1 text-[11px] text-amber-700">{ui.distortion}</p> : null}
        {c.spec.analog ? <p className="mt-1 text-[11px] text-slate-500">{ui.analog}</p> : null}
        <label className="mt-2 flex items-start gap-2 text-xs text-slate-700">
          <input type="checkbox" checked={!!c.outdoor} onChange={(e) => updateCam(c.id, (x) => ({ ...x, outdoor: e.target.checked }))} className="mt-0.5 h-4 w-4 accent-brand-600" />
          <span>{est.outdoor}<span className="block text-[11px] text-slate-500">{est.outdoorHint}</span></span>
        </label>
        <div className="mt-3 flex gap-1.5">
          <button type="button" className={btnCls} onClick={() => duplicateCam(c)}>{ui.duplicate}</button>
          <button type="button" className={btnCls} onClick={removeSelected}>{ui.remove}</button>
        </div>
      </div>
    );
  }
}
