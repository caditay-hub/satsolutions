// Презентабельный рендер отчёта в Telegram (HTML parse_mode).
// Числовые метрики — в моноширинных <pre>-таблицах с выравниванием по столбцам
// (подпись слева, значение по правому краю, дельта, эмодзи-стрелка в конце строки —
// чтобы переменная ширина эмодзи не ломала колонки). Заголовки секций — обычный
// текст с жирным/курсивом.
import { config } from "./config.js";
import { pctChange, fmt, type Alert } from "./analyze.js";
import { quickWins } from "./sources/searchConsole.js";
import { esc } from "./telegram.js";
import type { Snapshot } from "./snapshot.js";

const SEV_ICON: Record<Alert["severity"], string> = { critical: "🔴", warning: "🟡", info: "🔵" };
const CWV_ICON = { good: "🟢", ni: "🟡", poor: "🔴", na: "⚪" } as const;
const RULE = "➖➖➖➖➖➖➖➖➖➖";
const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

function humanDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

type Cell = { label: string; value: string; delta?: string; icon?: string };

/**
 * Моноширинная таблица: label выравнивается влево, value — вправо, delta — вправо,
 * icon ставится в конце. Padding считаем по сырым строкам, экранируем уже готовый
 * текст целиком (esc не трогает пробелы, поэтому выравнивание сохраняется).
 */
function table(rows: Cell[]): string {
  const width = (pick: (c: Cell) => string) => Math.max(...rows.map((r) => pick(r).length));
  const lw = width((r) => r.label);
  const vw = width((r) => r.value);
  const dw = width((r) => r.delta ?? "");
  const lines = rows.map((r) => {
    const parts = [r.label.padEnd(lw), r.value.padStart(vw)];
    if (dw) parts.push((r.delta ?? "").padStart(dw));
    let line = parts.join("  ");
    if (r.icon) line += "  " + r.icon;
    return line;
  });
  return `<pre>${esc(lines.join("\n"))}</pre>`;
}

/** Дельта в % + стрелка. higherIsBetter решает, помечать ли изменение как ⚠️. */
function deltaPct(cur: number, prev: number, higherIsBetter = true): { delta: string; icon: string } {
  const d = pctChange(cur, prev);
  if (Math.abs(d) < 1) return { delta: "0%", icon: "➖" };
  const arrow = d > 0 ? "📈" : "📉";
  const warn = d > 0 === higherIsBetter ? "" : " ⚠️";
  return { delta: `${d > 0 ? "+" : "−"}${fmt(Math.abs(d), 0)}%`, icon: arrow + warn };
}

function clip(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function renderReport(snap: Snapshot, alerts: Alert[], narrative: string): string {
  const L: string[] = [];

  // ── Шапка ─────────────────────────────────────────────
  L.push(`📊 <b>satsolutions.uz</b> · мониторинг`, `🗓 ${humanDate(snap.ts)}`, "");

  // ── Статус/проблемы ───────────────────────────────────
  const hot = alerts.filter((a) => a.severity !== "info");
  if (hot.length) {
    L.push(`🚨 <b>Проблемы (${hot.length})</b>`);
    for (const a of hot) L.push(`${SEV_ICON[a.severity]} <b>${esc(a.area)}:</b> ${esc(a.text)}`);
  } else {
    L.push(`✅ <b>Критичных проблем нет</b>`);
  }
  // Инфо-заметки (напр. лаг field-CWV после фикса) — тихо, не в «Проблемах».
  const notes = alerts.filter((a) => a.severity === "info");
  for (const a of notes) L.push(`🔵 <i>${esc(a.area)}: ${esc(a.text)}</i>`);

  // ── Поиск (Search Console) ────────────────────────────
  if (snap.gsc) {
    const { report, prev } = snap.gsc;
    const c = report.current;
    L.push("", RULE, `🔍 <b>Поиск</b> · Search Console`, `<i>${report.range.from} — ${report.range.to}</i>`);

    const clicks = deltaPct(c.clicks, prev.clicks);
    const impr = deltaPct(c.impressions, prev.impressions);
    const ctr = deltaPct(c.ctr, prev.ctr);
    const dPos = c.position - prev.position; // меньше = лучше
    const posCell =
      Math.abs(dPos) < 0.1
        ? { delta: "0", icon: "➖" }
        : dPos < 0
          ? { delta: `−${fmt(Math.abs(dPos), 1)}`, icon: "📈" }
          : { delta: `+${fmt(dPos, 1)}`, icon: "📉 ⚠️" };

    L.push(
      table([
        { label: "Клики", value: fmt(c.clicks), delta: clicks.delta, icon: clicks.icon },
        { label: "Показы", value: fmt(c.impressions), delta: impr.delta, icon: impr.icon },
        { label: "CTR", value: `${fmt(c.ctr * 100, 1)}%`, delta: ctr.delta, icon: ctr.icon },
        { label: "Ср. позиция", value: fmt(c.position, 1), delta: posCell.delta, icon: posCell.icon },
      ]),
    );

    const qw = quickWins(report);
    if (qw.length) {
      L.push(`🎯 <b>Быстрые победы</b> <i>(поз. 5–15)</i>`);
      L.push(
        table(qw.slice(0, 5).map((q) => ({
          label: clip(q.key, 24),
          value: fmt(q.position, 1),
          delta: `${fmt(q.impressions)} пок.`,
        }))),
      );
    }
  } else {
    L.push("", RULE, `🔍 <b>Поиск</b> — ⚠️ данные недоступны`);
  }

  // ── Трафик (GA4) ──────────────────────────────────────
  if (snap.ga4) {
    const g = snap.ga4;
    const ses = deltaPct(g.current.sessions, g.previous.sessions);
    const usr = deltaPct(g.current.activeUsers, g.previous.activeUsers);
    const cnv = deltaPct(g.current.conversions, g.previous.conversions);
    L.push("", RULE, `📈 <b>Трафик</b> · GA4`);
    L.push(
      table([
        { label: "Сессии", value: fmt(g.current.sessions), delta: ses.delta, icon: ses.icon },
        { label: "Пользователи", value: fmt(g.current.activeUsers), delta: usr.delta, icon: usr.icon },
        { label: "Конверсии", value: fmt(g.current.conversions), delta: cnv.delta, icon: cnv.icon },
      ]),
    );
    if (g.channels.length) {
      L.push(`<i>Каналы</i>`);
      L.push(table(g.channels.slice(0, 5).map((ch) => ({ label: clip(ch.channel, 18), value: `${fmt(ch.sessions)} сес.` }))));
    }
  } else {
    L.push("", RULE, `📈 <b>Трафик</b> — ⚠️ данные недоступны`);
  }

  // ── Реклама (Google Ads) ──────────────────────────────
  if (snap.ads) {
    const a = snap.ads;
    const cur = a.current;
    const prev = a.previous;
    const cy = a.currency ? ` ${a.currency}` : "";
    const impr = deltaPct(cur.impressions, prev.impressions);
    const clk = deltaPct(cur.clicks, prev.clicks);
    const cost = deltaPct(cur.cost, prev.cost, false); // рост расхода сам по себе не «хорошо»
    const cpc = deltaPct(cur.avgCpc, prev.avgCpc, false); // рост CPC — плохо
    const conv = deltaPct(cur.conversions, prev.conversions);
    L.push("", RULE, `📣 <b>Реклама</b> · Google Ads`, `<i>${a.range.from} — ${a.range.to}</i>`);
    L.push(
      table([
        { label: "Показы", value: fmt(cur.impressions), delta: impr.delta, icon: impr.icon },
        { label: "Клики", value: fmt(cur.clicks), delta: clk.delta, icon: clk.icon },
        { label: "CTR", value: `${fmt(cur.ctr * 100, 1)}%` },
        { label: "Ср. CPC", value: `${fmt(cur.avgCpc, 2)}${cy}`, delta: cpc.delta, icon: cpc.icon },
        { label: "Расход", value: `${fmt(cur.cost, 2)}${cy}`, delta: cost.delta, icon: cost.icon },
        { label: "Конверсии", value: fmt(cur.conversions, 1), delta: conv.delta, icon: conv.icon },
        { label: "Цена/конв.", value: cur.costPerConversion ? `${fmt(cur.costPerConversion, 2)}${cy}` : "—" },
      ]),
    );
  }

  // ── Скорость (Core Web Vitals) ────────────────────────
  if (snap.psi?.length) {
    L.push("", RULE, `⚡ <b>Скорость</b> · CWV <i>(моб.)</i>`);
    L.push(
      table(snap.psi.map((p) => ({
        label: clip(p.url.replace(config.siteUrl, "") || "/", 16),
        value: `${fmt(p.lcp.value)}мс`,
        delta: `CLS ${fmt(p.cls.value, 2)}`,
        icon: CWV_ICON[p.lcp.rating],
      }))),
    );
  }

  // ── Рекомендации (Claude) ─────────────────────────────
  if (narrative) L.push("", RULE, `💡 <b>Рекомендации</b>`, esc(narrative));

  // ── Ошибки сбора ──────────────────────────────────────
  if (snap.errors.length) {
    L.push("", `⚠️ <i>Не собралось:</i> ${esc(snap.errors.map((e) => e.split(":")[0]).join(", "))}`);
  }

  return L.join("\n");
}
