"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createServiceRequest } from "@/lib/api";
import { trackLead } from "@/lib/gtag";

/** Инлайн-форма «Рассчитать проект» в конце отраслевой страницы: посетитель дочитал
 *  до низа — форма уже перед ним, без поиска кнопки. Лид уходит в тот же канал CRM,
 *  что и модалка услуг (createServiceRequest), с пометкой отрасли. */
export function ProjectCalcForm({ serviceName }: { serviceName: string }) {
  const t = useTranslations("form");
  const [phoneRest, setPhoneRest] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<"ok" | "err" | null>(null);

  const digits = (v: string) => v.replace(/\D+/g, "");
  const fmt = (d: string) => {
    const x = digits(d).slice(0, 9);
    return [x.slice(0, 2), x.slice(2, 5), x.slice(5, 7), x.slice(7, 9)].filter(Boolean).join(" ");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits(phoneRest).length < 9) return;
    setBusy(true);
    setMsg(null);
    try {
      const phone = `+998${digits(phoneRest)}`;
      const r = await createServiceRequest({ serviceName, phone, description });
      if (r.success) {
        trackLead({ phone });
        setMsg("ok");
        setPhoneRest("");
        setDescription("");
      } else setMsg("err");
    } catch {
      setMsg("err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-slate-50">
      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-black tracking-tight text-slate-900">{t("calcTitle")}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t("calcSub")}</p>
          {msg === "ok" && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{t("srSuccess")}</div>
          )}
          {msg === "err" && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{t("srError")}</div>
          )}
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div className="flex overflow-hidden rounded-lg border border-slate-300">
              <div className="flex items-center bg-slate-50 px-3 text-sm font-semibold text-slate-700">+998</div>
              <input
                type="tel"
                value={fmt(phoneRest)}
                onChange={(e) => setPhoneRest(digits(e.target.value).slice(0, 9))}
                required
                placeholder="90 123 45 67"
                className="w-full px-3 py-2.5 text-sm outline-none"
                aria-label={t("phoneReq")}
              />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t("needPlaceholder")}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            />
            <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
              {busy ? t("sending") : t("sendRequest")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
