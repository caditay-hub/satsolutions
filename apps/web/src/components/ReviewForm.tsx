"use client";

import { useState } from "react";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.satsolutions.uz";
}

type UI = { title: string; hint: string; notes: string[]; comment: string; name: string; send: string; sending: string; thanks: string; err: string };

const STRINGS: Record<string, UI> = {
  ru: {
    title: "Оцените нашу работу",
    hint: "Нажмите на звёзды",
    notes: ["", "Плохо", "Так себе", "Нормально", "Хорошо", "Отлично"],
    comment: "Пара слов о работе — необязательно",
    name: "Имя — по желанию",
    send: "Отправить",
    sending: "Отправляем…",
    thanks: "Спасибо! Отзыв отправлен на проверку и появится после модерации.",
    err: "Не удалось отправить. Попробуйте позже.",
  },
  uz: {
    title: "Ishimizni baholang",
    hint: "Yulduzlarni bosing",
    notes: ["", "Yomon", "O'rtacha", "Normal", "Yaxshi", "A'lo"],
    comment: "Ish haqida bir-ikki so'z — ixtiyoriy",
    name: "Ism — ixtiyoriy",
    send: "Yuborish",
    sending: "Yuborilmoqda…",
    thanks: "Rahmat! Sharh tekshiruvga yuborildi va moderatsiyadan so'ng paydo bo'ladi.",
    err: "Yuborib bo'lmadi. Keyinroq urinib ko'ring.",
  },
  en: {
    title: "Rate our work",
    hint: "Tap the stars",
    notes: ["", "Poor", "Fair", "OK", "Good", "Excellent"],
    comment: "A few words about the work — optional",
    name: "Name — optional",
    send: "Submit",
    sending: "Sending…",
    thanks: "Thank you! Your review was sent for moderation and will appear once approved.",
    err: "Could not send. Please try later.",
  },
};

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-9 w-9 ${filled ? "text-amber-400" : "text-slate-200"}`} fill="currentColor">
      <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" />
    </svg>
  );
}

export function ReviewForm({ locale, serviceKey, productId }: { locale: string; serviceKey?: string; productId?: string }) {
  const t = STRINGS[locale] ?? STRINGS.ru;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const shown = hover || rating;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) return;
    setState("sending");
    try {
      const r = await fetch(`${apiBaseUrl()}/reviews`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rating, text: text.trim() || undefined, name: name.trim() || undefined, serviceKey, productId }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
        <p className="text-sm font-semibold leading-relaxed">✅ {t.thanks}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-lg font-black tracking-tight text-slate-900">{t.title}</div>
      <div className="mt-3 flex gap-1.5" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            className="transition-transform hover:scale-110"
            onMouseEnter={() => setHover(i)}
            onClick={() => setRating(i)}
            aria-label={`${i}/5`}
          >
            <Star filled={i <= shown} />
          </button>
        ))}
      </div>
      <div className="mt-1.5 min-h-[20px] text-sm font-bold text-slate-500">
        {shown ? `${t.notes[shown]} · ${shown}/5` : t.hint}
      </div>

      {rating > 0 && (
        <div className="mt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.comment}
            className="min-h-[80px] w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            maxLength={2000}
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.name}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            maxLength={120}
          />
          {state === "error" && <p className="mt-2 text-sm font-semibold text-rose-600">{t.err}</p>}
          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-3 w-full rounded-xl bg-brand-600 py-3 text-sm font-black text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {state === "sending" ? t.sending : t.send}
          </button>
        </div>
      )}
    </form>
  );
}
