"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackLead } from "@/lib/gtag";

// Быстрый заказ товара (одна позиция): кнопка «Заказать» → модалка с количеством
// и контактами → POST /orders → подтверждение с номером заказа. Требование
// Google Merchant «пользователь может завершить покупку»: оплата по счёту или
// при получении, без онлайн-эквайринга.
function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.satsolutions.uz";
}

const digitsOnly = (v: string) => v.replace(/\D+/g, "");

function formatUzRest(digits: string) {
  const d = digitsOnly(digits).slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");

export function OrderButton({
  productId,
  productName,
  price,
  label,
  variant = "brand",
  fullWidth = false,
}: {
  productId: string;
  productName: string;
  price?: number | string | null; // UZS; 0/null — «цена по запросу»
  label?: string;
  variant?: "brand" | "primary";
  fullWidth?: boolean;
}) {
  const t = useTranslations("form");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phoneRest, setPhoneRest] = useState("");
  const [comment, setComment] = useState("");

  const unit = Number(price ?? 0);
  const hasPrice = Number.isFinite(unit) && unit > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rest = digitsOnly(phoneRest).slice(0, 9);
    if (rest.length < 9) { setError(t("orderPhoneErr")); return; }
    setSending(true);
    try {
      const r = await fetch(`${apiBaseUrl()}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+998${rest}`,
          name: name || undefined,
          comment: comment || undefined,
          items: [{ productId, quantity: qty }],
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      // Короткий номер для клиента — хвост UUID (полный id хранится в системе)
      const id = String(data?.order?.id ?? "");
      setOrderNo(id ? id.replace(/-/g, "").slice(-6).toUpperCase() : "—");
      trackLead({ phone: `+998${rest}`, email: null });
    } catch {
      setError(t("errSend"));
    }
    setSending(false);
  }

  const reset = () => { setOpen(false); setOrderNo(null); setError(null); setQty(1); };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          (fullWidth ? "w-full text-center " : "") +
          (variant === "primary"
            ? "rounded-lg px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            : "rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-500 transition-colors")
        }
        style={variant === "primary" ? { backgroundColor: "#e02020" } : undefined}
      >
        {label ?? t("orderBtn")}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={reset}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {orderNo ? (
              <div className="py-4 text-center">
                <div className="mb-3 text-4xl">✅</div>
                <div className="text-lg font-bold">{t("orderAccepted")}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {t("orderNumber")}: <span className="font-mono font-bold text-slate-900">№ {orderNo}</span>
                </div>
                <div className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-left text-[13px] leading-relaxed text-slate-600">
                  <p>{t("orderNext")}</p>
                  <p className="mt-1.5">{t("orderPayment")}</p>
                  <Link href="/delivery" className="mt-1.5 inline-block font-semibold text-brand-700 underline" onClick={reset}>
                    {t("orderDeliveryLink")}
                  </Link>
                </div>
                <button type="button" onClick={reset}
                  className="mt-4 rounded-lg bg-slate-100 px-5 py-2 text-sm font-semibold hover:bg-slate-200">
                  {t("close")}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold">{t("orderTitle")}</div>
                    <div className="mt-0.5 text-xs text-slate-500 line-clamp-2">{productName}</div>
                  </div>
                  <button type="button" onClick={reset} className="text-2xl leading-none text-slate-400 hover:text-slate-700">×</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-sm text-slate-600">{t("orderQty")}</span>
                    <span className="inline-flex items-center gap-2">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-lg font-bold leading-none hover:bg-slate-100">−</button>
                      <input
                        value={qty}
                        onChange={(e) => setQty(Math.min(999, Math.max(1, Number(digitsOnly(e.target.value)) || 1)))}
                        inputMode="numeric"
                        className="h-8 w-14 rounded-lg border border-slate-300 text-center text-sm font-bold focus:outline-none focus:border-[#e02020]"
                      />
                      <button type="button" onClick={() => setQty((q) => Math.min(999, q + 1))}
                        className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-lg font-bold leading-none hover:bg-slate-100">+</button>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between px-1 text-sm">
                    <span className="text-slate-500">{t("orderTotal")}</span>
                    <span className="text-lg font-black text-[#e02020]">
                      {hasPrice ? `${fmt(unit * qty)} ${t("sum")}` : t("orderPriceOnRequest")}
                    </span>
                  </div>
                  <input
                    placeholder={t("yourName")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e02020]"
                  />
                  <div className="flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-[#e02020]">
                    <span className="flex items-center bg-slate-50 px-3 text-sm font-semibold text-slate-700">+998</span>
                    <input
                      required
                      inputMode="tel"
                      placeholder="90 123 45 67"
                      value={formatUzRest(phoneRest)}
                      onChange={(e) => setPhoneRest(digitsOnly(e.target.value).slice(0, 9))}
                      className="w-full px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <textarea
                    placeholder={t("orderComment")}
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#e02020]"
                  />
                  {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#e02020" }}
                  >
                    {sending ? t("sendingShort") : t("orderSubmit")}
                  </button>
                  <p className="text-center text-[11px] text-slate-500">{t("orderPayShort")} · {t("consent")}</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
