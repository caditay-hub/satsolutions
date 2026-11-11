"use client";

/**
 * Вкладки проектировщика: «План объекта» (этап C) и «Одна камера» (этап A/B).
 * Калькулятор приходит из серверной страницы готовым (его расчёт есть в HTML); редактор плана
 * грузится отдельным чанком. Вкладка отмечается в адресе через hash — query остаётся за калькулятором:
 * #plan — план (по умолчанию, решение владельца 11.11), #estimate — план со сметой без плана,
 * #camera — одна камера; без hash ссылка с параметрами расчёта (?v=…) открывает «Одну камеру».
 * Входы на первом экране страницы — обычные ссылки на эти hash: на странице у инструмента стоят
 * якоря с такими id, поэтому браузер сам прокручивает к нему, а здесь переключается вкладка.
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
  const [tab, setTab] = useState<"calc" | "plan">("plan");
  const [planMounted, setPlanMounted] = useState(false);
  /** Какой экран редактора открыть по входу с первого экрана: план (#plan) или смета без плана (#estimate). */
  const [view, setView] = useState<{ v: "plan" | "estimate"; n: number }>({ v: "plan", n: 0 });

  useEffect(() => {
    const sync = (nav: boolean) => {
      const h = window.location.hash;
      const calc = h === "#camera" || (!h && new URLSearchParams(window.location.search).has("v"));
      setTab(calc ? "calc" : "plan");
      if (!calc) setPlanMounted(true);
      if (h === "#estimate" || (nav && h === "#plan")) setView((x) => ({ v: h === "#estimate" ? "estimate" : "plan", n: x.n + 1 }));
    };
    sync(false);
    const onHash = () => sync(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function open(t: "calc" | "plan") {
    setTab(t);
    if (t === "plan") setPlanMounted(true);
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${search}${t === "plan" ? "#plan" : "#camera"}`);
  }

  const tabCls = (on: boolean) =>
    `min-h-[44px] rounded-xl px-4 py-2 text-sm font-bold transition-colors ${on ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-700 hover:text-brand-700"}`;

  return (
    <div>
      <div role="tablist" aria-label={`${p.plan.tabCalc} / ${p.plan.tabPlan}`} className="mb-5 inline-flex gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1">
        <button type="button" role="tab" id="cd-tab-plan" aria-selected={tab === "plan"} aria-controls="cd-panel-plan" className={tabCls(tab === "plan")} onClick={() => open("plan")}>{p.plan.tabPlan}</button>
        <button type="button" role="tab" id="cd-tab-calc" aria-selected={tab === "calc"} aria-controls="cd-panel-calc" className={tabCls(tab === "calc")} onClick={() => open("calc")}>{p.plan.tabCalc}</button>
      </div>
      {/* калькулятор не размонтируем: его состояние живёт, пока клиент работает с планом */}
      <div role="tabpanel" id="cd-panel-calc" aria-labelledby="cd-tab-calc" hidden={tab !== "calc"}>{p.children}</div>
      <div role="tabpanel" id="cd-panel-plan" aria-labelledby="cd-tab-plan" hidden={tab !== "plan"}>
        {planMounted ? <CameraPlanner ui={p.plan} est={p.est} levels={p.levels} ruLevels={p.ruLevels} locale={p.locale} view={view} /> : null}
      </div>
    </div>
  );
}
