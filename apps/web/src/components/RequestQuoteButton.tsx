"use client";

import { useState } from "react";
import { trackLead } from "@/lib/gtag";
import { useTranslations } from "next-intl";

export function RequestQuoteButton({
  productName,
  label = "📋 Запросить КП",
  variant = "outline",
  fullWidth = false,
}: {
  productName: string;
  label?: string;
  variant?: "outline" | "primary" | "white" | "brand";
  fullWidth?: boolean;
}) {
  const t = useTranslations("form");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch("https://api.satsolutions.uz/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Гость",
          phone,
          email: email || undefined,
          message: `Запрос КП по товару: ${productName}\n${comment ? "\n" + comment : ""}`,
        }),
      });
      if (r.ok) { setSent(true); trackLead(); }
    } catch {
      /* swallow */
    }
    setSending(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setSent(false); }}
        className={
          (fullWidth ? "w-full text-center " : "") +
          (variant === "brand"
            ? "rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-500 transition-colors"
            : variant === "primary"
            ? "rounded-lg px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            : variant === "white"
            ? "rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-brand-700 hover:bg-slate-100 transition-colors"
            : "rounded-lg border-2 px-3 py-1.5 text-sm font-semibold hover:bg-red-50 transition-colors")
        }
        style={
          variant === "primary"
            ? { backgroundColor: "#e02020" }
            : variant === "outline"
            ? { borderColor: "#e02020", color: "#e02020" }
            : undefined
        }
      >
        {label && label !== "📋 Запросить КП" ? label : t("quoteTitle")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {sent ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <div className="text-lg font-bold mb-1">{t("quoteSent")}</div>
                <div className="text-sm text-slate-600">{t("quoteSentSub")}</div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-lg bg-slate-100 hover:bg-slate-200 px-5 py-2 text-sm font-semibold"
                >
                  {t("close")}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold">{t("quoteTitle")}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{productName}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
                  >×</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                  <input
                    required
                    placeholder={t("yourName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e02020]"
                  />
                  <input
                    required
                    placeholder={t("phoneReq")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e02020]"
                  />
                  <input
                    type="email"
                    placeholder={t("emailOpt")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e02020]"
                  />
                  <textarea
                    placeholder={t("comment")}
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e02020] resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#e02020" }}
                  >
                    {sending ? t("sendingShort") : t("sendRequest")}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center">
                    {t("consent")}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
