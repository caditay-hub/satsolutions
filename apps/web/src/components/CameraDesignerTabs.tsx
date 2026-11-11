"use client";

/**
 * Режимы проектировщика (редизайн 11.11.2026, решение владельца): «Одна камера» → «Подобрать
 * камеру» → «План объекта». Калькулятор приходит из серверной страницы готовым (его расчёт есть
 * в HTML) и обслуживает первые два режима — какой из них, он узнаёт из контекста; редактор плана
 * грузится отдельным чанком. Режим отмечается в адресе через hash — query остаётся за калькулятором:
 * #camera — одна камера (по умолчанию), #pick — подбор, #plan — план, #estimate — план со сметой
 * без плана. Без hash: ссылка подбора (?m=task) открывает подбор, остальные — одну камеру.
 * Меню, главная и разделы каталога ссылаются на #plan и продолжают открывать план.
 */
import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CdPlanUi } from "@/lib/cameraDesigner/planContent";
import type { CdEstUi } from "@/lib/cameraDesigner/estContent";
import type { LevelCode } from "@/lib/cameraDesigner/standards";

const CameraPlanner = dynamic(() => import("@/components/planner/CameraPlanner").then((m) => m.CameraPlanner), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">…</div>,
});

export type CdMode = "camera" | "pick";
const ModeCtx = createContext<{ mode: CdMode; setMode: (m: CdMode) => void }>({ mode: "camera", setMode: () => {} });
/** Режим калькулятора: одна камера или подбор. */
export const useCdMode = () => useContext(ModeCtx);

type Tab = CdMode | "plan";
const HASH: Record<Tab, string> = { camera: "#camera", pick: "#pick", plan: "#plan" };

export function CameraDesignerTabs(p: {
  children: ReactNode;
  tabs: Record<Tab, string>;
  plan: CdPlanUi;
  est: CdEstUi;
  levels: Record<LevelCode, { name: string }>;
  ruLevels: Record<LevelCode, string>;
  locale: string;
}) {
  const [tab, setTab] = useState<Tab>("camera");
  const [planMounted, setPlanMounted] = useState(false);
  /** Какой экран редактора открыть по входу: план (#plan) или смета без плана (#estimate). */
  const [view, setView] = useState<{ v: "plan" | "estimate"; n: number }>({ v: "plan", n: 0 });

  useEffect(() => {
    const sync = (nav: boolean) => {
      const h = window.location.hash;
      const q = new URLSearchParams(window.location.search);
      const t: Tab = h === "#plan" || h === "#estimate" || (!h && q.has("example")) ? "plan"
        : h === "#pick" || (!h && q.get("m") === "task") ? "pick" : "camera";
      setTab(t);
      if (t === "plan") setPlanMounted(true);
      if (h === "#estimate" || (nav && h === "#plan")) setView((x) => ({ v: h === "#estimate" ? "estimate" : "plan", n: x.n + 1 }));
    };
    sync(false);
    const onHash = () => sync(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function open(t: Tab) {
    setTab(t);
    if (t === "plan") setPlanMounted(true);
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${search}${HASH[t]}`);
  }

  const tabCls = (on: boolean) =>
    `min-h-[44px] flex-1 rounded-xl px-2 py-1.5 text-[13px] font-bold leading-tight sm:whitespace-nowrap sm:text-sm transition-colors sm:flex-none sm:px-5 ${on ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-brand-700"}`;
  const order: Tab[] = ["camera", "pick", "plan"];

  return (
    <ModeCtx.Provider value={{ mode: tab === "pick" ? "pick" : "camera", setMode: (m) => open(m) }}>
      <div role="tablist" aria-label={order.map((t) => p.tabs[t]).join(" / ")} className="mb-4 flex gap-1 rounded-2xl bg-slate-100 p-1 sm:inline-flex">
        {order.map((t) => (
          <button key={t} type="button" role="tab" id={`cd-tab-${t}`} aria-selected={tab === t} aria-controls={t === "plan" ? "cd-panel-plan" : "cd-panel-calc"}
            className={tabCls(tab === t)} onClick={() => open(t)}>
            {p.tabs[t]}
          </button>
        ))}
      </div>
      {/* калькулятор не размонтируем: его состояние живёт, пока клиент работает с планом */}
      <div role="tabpanel" id="cd-panel-calc" aria-labelledby={`cd-tab-${tab === "pick" ? "pick" : "camera"}`} hidden={tab === "plan"}>{p.children}</div>
      <div role="tabpanel" id="cd-panel-plan" aria-labelledby="cd-tab-plan" hidden={tab !== "plan"}>
        {planMounted ? <CameraPlanner ui={p.plan} est={p.est} levels={p.levels} ruLevels={p.ruLevels} locale={p.locale} view={view} /> : null}
      </div>
    </ModeCtx.Provider>
  );
}
