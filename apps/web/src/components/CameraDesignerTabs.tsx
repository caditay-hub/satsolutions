"use client";

/**
 * Вкладки калькулятора объектива: «Одна камера» (этап A/B) и «План объекта» (этап C).
 * Калькулятор приходит из серверной страницы готовым (его расчёт есть в HTML); редактор плана
 * грузится отдельным чанком только при первом открытии вкладки. Вкладка отмечается в адресе
 * через #plan — query остаётся за калькулятором.
 */
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import type { CdPlanUi } from "@/lib/cameraDesigner/planContent";
import type { CdEstUi } from "@/lib/cameraDesigner/estContent";
import type { LevelCode } from "@/lib/cameraDesigner/standards";

const CameraPlanner = dynamic(() => import("@/components/planner/CameraPlanner").then((m) => m.CameraPlanner), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">…</div>,
});

export function CameraDesignerTabs(p: {
  children: ReactNode;
  plan: CdPlanUi;
  est: CdEstUi;
  levels: Record<LevelCode, { name: string }>;
  ruLevels: Record<LevelCode, string>;
  locale: string;
}) {
  const [tab, setTab] = useState<"calc" | "plan">("calc");
  const [planMounted, setPlanMounted] = useState(false);

  useEffect(() => {
    const sync = () => {
      const plan = window.location.hash === "#plan";
      setTab(plan ? "plan" : "calc");
      if (plan) setPlanMounted(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function open(t: "calc" | "plan") {
    setTab(t);
    if (t === "plan") setPlanMounted(true);
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${search}${t === "plan" ? "#plan" : ""}`);
  }

  const tabCls = (on: boolean) =>
    `min-h-[44px] rounded-xl px-4 py-2 text-sm font-bold transition-colors ${on ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-700 hover:text-brand-700"}`;

  return (
    <div>
      <div role="tablist" aria-label={`${p.plan.tabCalc} / ${p.plan.tabPlan}`} className="mb-5 inline-flex gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1">
        <button type="button" role="tab" id="cd-tab-calc" aria-selected={tab === "calc"} aria-controls="cd-panel-calc" className={tabCls(tab === "calc")} onClick={() => open("calc")}>{p.plan.tabCalc}</button>
        <button type="button" role="tab" id="cd-tab-plan" aria-selected={tab === "plan"} aria-controls="cd-panel-plan" className={tabCls(tab === "plan")} onClick={() => open("plan")}>{p.plan.tabPlan}</button>
      </div>
      {/* калькулятор не размонтируем: его состояние живёт, пока клиент работает с планом */}
      <div role="tabpanel" id="cd-panel-calc" aria-labelledby="cd-tab-calc" hidden={tab !== "calc"}>{p.children}</div>
      <div role="tabpanel" id="cd-panel-plan" aria-labelledby="cd-tab-plan" hidden={tab !== "plan"}>
        {planMounted ? <CameraPlanner ui={p.plan} est={p.est} levels={p.levels} ruLevels={p.ruLevels} locale={p.locale} /> : null}
      </div>
    </div>
  );
}
