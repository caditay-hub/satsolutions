// Анализ собранных данных: (1) жёсткие правила-алерты (срабатывают сразу),
// (2) нарративный разбор и приоритезация задач через Claude.
import { config } from "./config.js";
import type { Snapshot } from "./snapshot.js";
import { quickWins } from "./sources/searchConsole.js";

export type Severity = "critical" | "warning" | "info";
export type Alert = { severity: Severity; area: string; text: string };

export function pctChange(cur: number, prev: number): number {
  if (!prev) return cur ? 100 : 0;
  return ((cur - prev) / prev) * 100;
}

export const fmt = (n: number, d = 0) => n.toLocaleString("ru-RU", { maximumFractionDigits: d });
export const sign = (n: number) => (n >= 0 ? "+" : "");

/** Правила-алерты по порогам из config.thresholds. */
export function detectAlerts(snap: Snapshot): Alert[] {
  const t = config.thresholds;
  const alerts: Alert[] = [];

  // --- GSC: клики и позиции ---
  if (snap.gsc) {
    const { report, prev } = snap.gsc;
    const dClicks = pctChange(report.current.clicks, prev.clicks);
    if (dClicks <= -t.clicksDropPct) {
      alerts.push({
        severity: "critical",
        area: "SEO",
        text: `Клики из поиска упали на ${fmt(Math.abs(dClicks), 0)}% WoW (${fmt(prev.clicks)} → ${fmt(report.current.clicks)}).`,
      });
    }
    // Ухудшение средней позиции (в GSC больше = хуже).
    const dPos = report.current.position - prev.position;
    if (dPos >= t.positionDrop) {
      alerts.push({
        severity: "warning",
        area: "SEO",
        text: `Средняя позиция ухудшилась на ${fmt(dPos, 1)} п. (${fmt(prev.position, 1)} → ${fmt(report.current.position, 1)}).`,
      });
    }
  }

  // --- GA4: сессии ---
  if (snap.ga4) {
    const d = pctChange(snap.ga4.current.sessions, snap.ga4.previous.sessions);
    if (d <= -t.sessionsDropPct) {
      alerts.push({
        severity: "critical",
        area: "Трафик",
        text: `Сессии GA4 упали на ${fmt(Math.abs(d), 0)}% WoW (${fmt(snap.ga4.previous.sessions)} → ${fmt(snap.ga4.current.sessions)}).`,
      });
    }
    if (snap.ga4.current.conversions === 0 && snap.ga4.previous.conversions > 0) {
      alerts.push({
        severity: "critical",
        area: "Конверсии",
        text: `За окно 0 конверсий (было ${fmt(snap.ga4.previous.conversions)}). Проверить трекинг/формы.`,
      });
    }
  }

  // --- Google Ads: рост CPC + расход без конверсий ---
  if (snap.ads) {
    const a = snap.ads;
    const dCpc = pctChange(a.current.avgCpc, a.previous.avgCpc);
    if (a.previous.avgCpc > 0 && dCpc >= t.cpcRisePct) {
      alerts.push({
        severity: "warning",
        area: "Реклама",
        text: `Средний CPC вырос на ${fmt(dCpc, 0)}% WoW (${fmt(a.previous.avgCpc, 2)} → ${fmt(a.current.avgCpc, 2)}).`,
      });
    }
    if (a.current.cost > 0 && a.current.conversions === 0) {
      alerts.push({
        severity: "warning",
        area: "Реклама",
        text: `Расход ${fmt(a.current.cost, 2)} за окно при 0 конверсий — проверить кампании/трекинг.`,
      });
    }
  }

  // --- PSI: Core Web Vitals ---
  for (const p of snap.psi ?? []) {
    const bad: string[] = [];
    if (p.lcp.rating === "poor") bad.push(`LCP ${fmt(p.lcp.value)}мс`);
    if (p.cls.rating === "poor") bad.push(`CLS ${fmt(p.cls.value, 2)}`);
    if (p.inp.rating === "poor") bad.push(`INP ${fmt(p.inp.value)}мс`);
    if (bad.length) {
      alerts.push({
        severity: "warning",
        area: "Производительность",
        text: `${p.url}: плохие CWV — ${bad.join(", ")} (${p.source}).`,
      });
    }
  }

  return alerts;
}

/** Краткая текстовая сводка цифр — идёт и в Telegram, и в промпт Claude. */
export function buildDigest(snap: Snapshot): string {
  const lines: string[] = [];

  if (snap.gsc) {
    const { report, prev } = snap.gsc;
    const c = report.current;
    lines.push(
      `SEO (GSC, ${report.range.from}…${report.range.to}): клики ${fmt(c.clicks)} (${sign(pctChange(c.clicks, prev.clicks))}${fmt(pctChange(c.clicks, prev.clicks), 0)}%), ` +
        `показы ${fmt(c.impressions)} (${sign(pctChange(c.impressions, prev.impressions))}${fmt(pctChange(c.impressions, prev.impressions), 0)}%), ` +
        `CTR ${fmt(c.ctr * 100, 1)}%, поз. ${fmt(c.position, 1)}.`,
    );
    const qw = quickWins(report);
    if (qw.length) {
      lines.push("Быстрые победы (поз. 5–15, много показов):");
      qw.slice(0, 6).forEach((q) => lines.push(`  • «${q.key}» — поз. ${fmt(q.position, 1)}, показов ${fmt(q.impressions)}`));
    }
  }

  if (snap.ga4) {
    const g = snap.ga4;
    lines.push(
      `Трафик (GA4): сессии ${fmt(g.current.sessions)} (${sign(pctChange(g.current.sessions, g.previous.sessions))}${fmt(pctChange(g.current.sessions, g.previous.sessions), 0)}%), ` +
        `пользователи ${fmt(g.current.activeUsers)}, конверсии ${fmt(g.current.conversions)} (${sign(pctChange(g.current.conversions, g.previous.conversions))}${fmt(pctChange(g.current.conversions, g.previous.conversions), 0)}%).`,
    );
    if (g.channels.length) {
      lines.push("Каналы: " + g.channels.slice(0, 5).map((c) => `${c.channel} ${fmt(c.sessions)}с/${fmt(c.conversions)}к`).join(", "));
    }
  }

  if (snap.ads) {
    const a = snap.ads;
    const cy = a.currency ? ` ${a.currency}` : "";
    lines.push(
      `Реклама (Google Ads, ${a.range.from}…${a.range.to}): расход ${fmt(a.current.cost, 2)}${cy} (${sign(pctChange(a.current.cost, a.previous.cost))}${fmt(pctChange(a.current.cost, a.previous.cost), 0)}%), ` +
        `клики ${fmt(a.current.clicks)}, CPC ${fmt(a.current.avgCpc, 2)}${cy}, конверсии ${fmt(a.current.conversions, 1)}, ` +
        `цена/конв. ${a.current.costPerConversion ? fmt(a.current.costPerConversion, 2) + cy : "—"}.`,
    );
  }

  if (snap.psi?.length) {
    lines.push(
      "CWV (mobile): " +
        snap.psi.map((p) => `${p.url.replace(config.siteUrl, "")} LCP ${fmt(p.lcp.value)}/${p.lcp.rating}`).join("; "),
    );
  }

  if (snap.errors.length) lines.push("⚠ Ошибки сбора: " + snap.errors.join(" | "));

  return lines.join("\n");
}

/**
 * Нарративный разбор через Claude: 3–6 приоритетных рекомендаций с учётом SEO-
 * правил проекта (slug/301, canonical+hreflang, sitemap, i18n 5 языков). Без
 * ключа/при ошибке возвращает пустую строку — отчёт всё равно уйдёт с цифрами.
 */
export async function narrativeFromClaude(snap: Snapshot): Promise<string> {
  if (!config.anthropicApiKey) return "";
  const digest = buildDigest(snap);
  const prompt = `Ты SEO/перформанс-аналитик сайта ${config.siteUrl} (B2B, рынок Узбекистан, языки ru/uz/en/tr/zh).
Вот данные за последнее окно по сравнению с предыдущим:

${digest}

Дай НЕ БОЛЕЕ 6 конкретных приоритетных рекомендаций (маркированный список), отсортированных по влиянию×простоте.
Для каждой: что сделать и ожидаемый эффект, кратко. Учитывай правила сайта: при изменении URL — slug+301, canonical+hreflang, sitemap, i18n на 5 языков.
Не повторяй цифры, не лей воду. Только actionable.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": config.anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: config.anthropicModel,
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      console.error(`[claude] ${res.status}: ${await res.text()}`);
      return "";
    }
    const data: any = await res.json();
    return (data.content?.[0]?.text ?? "").trim();
  } catch (e) {
    console.error(`[claude] ${(e as Error).message}`);
    return "";
  }
}
