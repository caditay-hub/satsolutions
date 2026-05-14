"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export function FeedbackForm({ hideHeader }: { hideHeader?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [phoneRest, setPhoneRest] = useState("");
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
  };

  function digitsOnly(v: string) {
    return v.replace(/\D+/g, "");
  }

  function formatUzRest(digits: string) {
    const d = digitsOnly(digits).slice(0, 9);
    const a = d.slice(0, 2);
    const b = d.slice(2, 5);
    const c = d.slice(5, 7);
    const e = d.slice(7, 9);
    return [a, b, c, e].filter(Boolean).join(" ");
  }

  const canSend = useMemo(() => {
    const m = message.trim();
    return status !== "sending" && m.length >= 5 && m.length <= 3000;
  }, [status, message]);

  async function submit() {
    if (!canSend) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl()}/feedback`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim() || null,
          phone: phoneRest.trim() ? `+998${digitsOnly(phoneRest)}` : null,
          email: email.trim() || null,
          message: message.trim()
        })
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = `Ошибка: ${res.status}`;
        try {
          const j = JSON.parse(text) as any;
          if (j?.error) msg = j.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      setStatus("ok");
      setName("");
      setPhoneRest("");
      setEmail("");
      setMessage("");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message ?? "Ошибка отправки");
    }
  }

  return (
    <div className={`rounded-2xl ${hideHeader ? "" : "border border-slate-200 bg-white p-6"}`} data-aos="fade-up">
      {!hideHeader ? (
        <>
          <div className="text-lg font-bold text-slate-950">Обратная связь</div>
          <div className="mt-1 text-base font-semibold text-slate-800">Оставьте сообщение — мы свяжемся с вами.</div>
        </>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <div className="text-sm font-bold text-slate-900">Имя</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-base font-medium text-slate-950 focus:border-brand-600 outline-none transition-colors"
            placeholder="Ваше имя"
          />
        </label>
        <label className="block">
          <div className="text-sm font-bold text-slate-900">Телефон</div>
          <div className="mt-1 flex overflow-hidden rounded-lg border-2 border-slate-300 focus-within:border-brand-600 transition-colors">
            <div className="flex items-center bg-slate-100 px-4 text-base font-bold text-slate-900">+998</div>
            <input
              inputMode="tel"
              value={formatUzRest(phoneRest)}
              onChange={(e) => setPhoneRest(digitsOnly(e.target.value).slice(0, 9))}
              placeholder="90 123 45 67"
              className="w-full px-4 py-3 text-base font-medium text-slate-950 outline-none"
            />
          </div>
        </label>
        <label className="block">
          <div className="text-sm font-bold text-slate-900">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-base font-medium text-slate-950 focus:border-brand-600 outline-none transition-colors"
            placeholder="mail@example.com"
            inputMode="email"
          />
        </label>
      </div>
      <div className="mt-3">
        <label className="block">
          <div className="text-sm font-bold text-slate-900">Сообщение</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-base font-medium text-slate-950 focus:border-brand-600 outline-none transition-colors"
            rows={5}
            placeholder="Напишите ваш вопрос..."
          />
        </label>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 sm:col-span-2">
        <button
          type="button"
          onClick={() => void submit()}
          disabled={!canSend}
          className="btn-primary"
        >
          {status === "sending" ? "Отправка..." : "Отправить"}
        </button>
      </div>
      {status === "ok" ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          Сообщение отправлено. Спасибо!
        </div>
      ) : null}
      {status === "error" && error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div>
      ) : null}
    </div>
  );
}
