"use client";

import { useState } from "react";
import { trackLead } from "@/lib/gtag";
import { useTranslations } from "next-intl";

/**
 * Форма «Расчёт проекта» — квалифицированная заявка для крупных объектов.
 * В отличие от кнопки «Получить КП» собирает тип объекта, состав систем, масштаб
 * и сроки, поэтому менеджер сразу видит размер задачи.
 * Уходит в тот же POST /feedback: оттуда CRM-обращение + карточка в чат менеджеров.
 */

const OBJECTS = ["factory", "warehouse", "office", "residential", "retail", "school", "medical", "hotel", "fuel", "construction", "other"] as const;
const SYSTEMS = ["cctv", "access", "fire", "network", "intercom", "barrier", "server", "videowall"] as const;
const TERMS = ["urgent", "month", "quarter", "planning"] as const;

// ключ отраслевой страницы → тип объекта в форме (совпадают не все: страница
// «Промышленность» = factory, «Банки и офисы» = office, у остальных ключ тот же)
const PAGE_TO_OBJECT: Record<string, string> = { industry: "factory", bank: "office" };

export function ProjectQuoteForm({ industryKey, variant = "section" }: { industryKey?: string; variant?: "section" | "compact" }) {
  const t = useTranslations("projectForm");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const initialObject = (() => {
    if (!industryKey) return "";
    const mapped = PAGE_TO_OBJECT[industryKey] ?? industryKey;
    return (OBJECTS as readonly string[]).includes(mapped) ? mapped : "";
  })();
  const [object, setObject] = useState<string>(initialObject);
  const [systems, setSystems] = useState<string[]>([]);
  const [scale, setScale] = useState("");
  const [term, setTerm] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const toggle = (k: string) => setSystems((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSending(true);
    // Текст письма собираем по-русски: его читают менеджеры в Telegram и CRM
    const lines = [
      "🏗 РАСЧЁТ ПРОЕКТА (заявка с сайта)",
      object ? `Объект: ${t(`objects.${object}`)}` : null,
      systems.length ? `Системы: ${systems.map((s) => t(`systems.${s}`)).join(", ")}` : null,
      scale ? `Масштаб: ${scale}` : null,
      term ? `Сроки: ${t(`terms.${term}`)}` : null,
      company ? `Компания: ${company}` : null,
      comment ? `Комментарий: ${comment}` : null,
      industryKey ? `Страница: /solutions/${industryKey}` : null,
    ].filter(Boolean);
    try {
      const r = await fetch("https://api.satsolutions.uz/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Гость",
          phone,
          email: email || undefined,
          message: lines.join("\n"),
        }),
      });
      if (r.ok) {
        setSent(true);
        const ph = phone.startsWith("+") ? phone : `+998${phone.replace(/\D/g, "").slice(-9)}`;
        trackLead({ phone: ph, email: email || null });
      }
    } catch {
      /* тихо: пользователю показываем общий результат ниже */
    }
    setSending(false);
  }

  const chip = (active: boolean) =>
    `rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
      active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"
    }`;
  const input = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500";

  if (sent) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
        <div className="text-3xl">✅</div>
        <div className="mt-2 text-lg font-black text-emerald-900">{t("sentTitle")}</div>
        <p className="mt-1 text-sm text-emerald-800">{t("sentText")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={variant === "section" ? "rounded-2xl bg-white p-5 sm:p-7 shadow-lg ring-1 ring-slate-200" : ""}>
      <div className="text-xs font-bold uppercase tracking-wider text-brand-600">{t("badge")}</div>
      <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("title")}</h2>
      <p className="mt-1.5 text-sm text-slate-600">{t("subtitle")}</p>

      <div className="mt-5">
        <div className="text-xs font-semibold text-slate-500 mb-2">{t("objectLabel")}</div>
        <div className="flex flex-wrap gap-2">
          {OBJECTS.map((o) => (
            <button key={o} type="button" onClick={() => setObject(object === o ? "" : o)} className={chip(object === o)}>
              {t(`objects.${o}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-500 mb-2">{t("systemsLabel")}</div>
        <div className="flex flex-wrap gap-2">
          {SYSTEMS.map((s) => (
            <button key={s} type="button" onClick={() => toggle(s)} className={chip(systems.includes(s))}>
              {t(`systems.${s}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2">{t("scaleLabel")}</div>
          <input className={input} placeholder={t("scalePlaceholder")} value={scale} onChange={(e) => setScale(e.target.value)} />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2">{t("termLabel")}</div>
          <div className="flex flex-wrap gap-2">
            {TERMS.map((x) => (
              <button key={x} type="button" onClick={() => setTerm(term === x ? "" : x)} className={chip(term === x)}>
                {t(`terms.${x}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input className={input} placeholder={t("company")} value={company} onChange={(e) => setCompany(e.target.value)} />
        <input className={input} placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} />
        <input className={input} required placeholder={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
        <input className={input} placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </div>

      <textarea className={`${input} mt-3 min-h-[76px]`} placeholder={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} />

      <button
        type="submit"
        disabled={sending || !phone.trim()}
        className="mt-4 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-500 disabled:opacity-50 transition-colors"
      >
        {sending ? t("sending") : t("submit")}
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">{t("note")}</p>
    </form>
  );
}
