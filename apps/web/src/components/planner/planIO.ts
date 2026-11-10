/**
 * Ввод-вывод плана объекта (этап C), только в браузере: чтение PNG/JPG/PDF, автосохранение в
 * IndexedDB, скачивание файлов. На сервер план не уходит (решение владельца 10.11); исключение —
 * картинка, которую клиент сам приложил к заявке (это делает CameraPlanner).
 */
import { PLAN_LIMITS } from "@/lib/cameraDesigner/plan/project";

export type PlanImage = { dataUrl: string; wPx: number; hPx: number };

export type FileKind = "png" | "jpeg" | "pdf" | "json" | null;

/** Тип файла по первым байтам (а не по расширению и не по MIME из браузера). */
export async function sniff(file: Blob): Promise<FileKind> {
  const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "pdf"; // %PDF
  if (b[0] === 0x7b || (b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf && b[3] === 0x7b)) return "json"; // { (с BOM или без)
  return null;
}

/** Холст → data:-URL: линейные чертежи лучше в PNG, но крупный PNG перекодируем в JPEG. */
function encode(canvas: HTMLCanvasElement): string {
  const png = canvas.toDataURL("image/png");
  return png.length <= 12 * 1024 * 1024 ? png : canvas.toDataURL("image/jpeg", 0.9);
}

function fit(w: number, h: number) {
  const k = Math.min(1, PLAN_LIMITS.imagePx / Math.max(w, h));
  return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) };
}

/** PNG/JPG → картинка плана не больше 4096 px по длинной стороне. */
export async function loadRaster(file: Blob): Promise<PlanImage> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("image"));
      i.src = url;
    });
    const { w, h } = fit(img.naturalWidth, img.naturalHeight);
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff"; // прозрачный PNG — на белом, как на бумаге
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return { dataUrl: encode(c), wPx: w, hPx: h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ───────────── PDF (pdf.js, только по требованию) ───────────── */

type PdfDoc = { numPages: number; getPage: (n: number) => Promise<PdfPage>; destroy: () => Promise<void> };
type PdfPage = {
  getViewport: (o: { scale: number }) => { width: number; height: number };
  render: (o: { canvasContext: CanvasRenderingContext2D; viewport: unknown; background?: string }) => { promise: Promise<void> };
};

export async function openPdf(file: Blob): Promise<PdfDoc> {
  // legacy-сборка — для браузеров без новейших API; грузится только когда открывают PDF
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
  const data = new Uint8Array(await file.arrayBuffer());
  // без eval и без XFA-форм: PDF только рисуем, скрипты документа не выполняются
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false, enableXfa: false }).promise;
  return doc as unknown as PdfDoc;
}

export async function renderPdfPage(doc: PdfDoc, n: number): Promise<PlanImage> {
  const page = await doc.getPage(n);
  const base = page.getViewport({ scale: 1 });
  const { w } = fit(base.width * 4, base.height * 4); // чертёж рендерим крупно, но не больше лимита
  const vp = page.getViewport({ scale: w / base.width });
  const c = document.createElement("canvas");
  c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, viewport: vp, background: "#fff" }).promise;
  return { dataUrl: encode(c), wPx: c.width, hPx: c.height };
}

/* ───────────── IndexedDB: проект в этом браузере ───────────── */

const DB = "sat-camera-plan", STORE = "kv", KEY = "current";

function db(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function idbSave(v: unknown): Promise<void> {
  const d = await db();
  await new Promise<void>((res, rej) => {
    const tx = d.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(v, KEY);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  d.close();
}

export async function idbLoad(): Promise<unknown> {
  const d = await db();
  const v = await new Promise<unknown>((res, rej) => {
    const r = d.transaction(STORE, "readonly").objectStore(STORE).get(KEY);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  d.close();
  return v;
}

export async function idbClear(): Promise<void> {
  const d = await db();
  await new Promise<void>((res, rej) => {
    const tx = d.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  d.close();
}

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const loadImage = (src: string) => new Promise<HTMLImageElement>((res, rej) => {
  const i = new Image();
  i.onload = () => res(i);
  i.onerror = () => rej(new Error("image"));
  i.src = src;
});
