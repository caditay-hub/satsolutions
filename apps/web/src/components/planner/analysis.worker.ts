// Воркер анализа плана: растровый расчёт покрытия не тормозит перетаскивание камер.
// Математика — lib/cameraDesigner/plan/analysis.ts (та же, что в тестах).
import { analyze, type AnalysisInput } from "@/lib/cameraDesigner/plan/analysis";

const ctx = self as unknown as { onmessage: ((e: MessageEvent<{ id: number; input: AnalysisInput }>) => void) | null; postMessage: (m: unknown, t: Transferable[]) => void };

ctx.onmessage = (e) => {
  const r = analyze(e.data.input);
  ctx.postMessage({ id: e.data.id, r }, [r.best.buffer, r.count.buffer]);
};
