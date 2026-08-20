"use client";

import { useState } from "react";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.satsolutions.uz";
}

type UI = { title: string; sub: string; q: string; name: string; phone: string; send: string; sending: string; thanks: string; err: string; short: string };

const STRINGS: Record<string, UI> = {
  ru: {
    title: "Вопрос инженеру",
    sub: "Совместимость, монтаж, подбор — ответим и опубликуем ответ на этой странице.",
    q: "Ваш вопрос о товаре",
    name: "Имя — по желанию",
    phone: "Телефон — если нужен личный ответ",
    send: "Отправить вопрос",
    sending: "Отправляем…",
    thanks: "Вопрос отправлен инженеру. Ответ появится здесь после проверки, а при указанном телефоне — свяжемся лично.",
    err: "Не удалось отправить. Попробуйте позже.",
    short: "Опишите вопрос чуть подробнее (от 10 символов).",
  },
  uz: {
    title: "Muhandisga savol",
    sub: "Moslik, montaj, tanlash — javob beramiz va javobni shu sahifada e'lon qilamiz.",
    q: "Mahsulot haqidagi savolingiz",
    name: "Ism — ixtiyoriy",
    phone: "Telefon — shaxsiy javob kerak bo'lsa",
    send: "Savol yuborish",
    sending: "Yuborilmoqda…",
    thanks: "Savol muhandisga yuborildi. Javob tekshiruvdan so'ng shu yerda chiqadi; telefon ko'rsatilgan bo'lsa — o'zimiz bog'lanamiz.",
    err: "Yuborib bo'lmadi. Keyinroq urinib ko'ring.",
    short: "Savolni biroz batafsilroq yozing (kamida 10 belgi).",
  },
  en: {
    title: "Ask the engineer",
    sub: "Compatibility, installation, selection — we'll answer and publish the reply on this page.",
    q: "Your question about the product",
    name: "Name — optional",
    phone: "Phone — if you want a personal reply",
    send: "Send question",
    sending: "Sending…",
    thanks: "Your question went to our engineer. The answer will appear here after review; with a phone number we'll also contact you directly.",
    err: "Could not send. Please try again later.",
    short: "Please describe the question in a bit more detail (10+ characters).",
  },
  tr: {
    title: "Mühendise sorun",
    sub: "Uyumluluk, montaj, seçim — yanıtlayıp cevabı bu sayfada yayınlarız.",
    q: "Ürünle ilgili sorunuz",
    name: "İsim — isteğe bağlı",
    phone: "Telefon — kişisel yanıt isterseniz",
    send: "Soruyu gönder",
    sending: "Gönderiliyor…",
    thanks: "Sorunuz mühendise iletildi. Yanıt incelemeden sonra burada yayınlanır; telefon bıraktıysanız ayrıca sizi ararız.",
    err: "Gönderilemedi. Lütfen daha sonra deneyin.",
    short: "Soruyu biraz daha ayrıntılı yazın (en az 10 karakter).",
  },
  zh: {
    title: "向工程师提问",
    sub: "兼容性、安装、选型——我们会回答并在本页公布答案。",
    q: "您对该产品的问题",
    name: "姓名（选填）",
    phone: "电话（需要专人答复时填写）",
    send: "发送问题",
    sending: "发送中…",
    thanks: "问题已发送给工程师。审核后答案将显示在此处；留有电话我们也会直接联系您。",
    err: "发送失败，请稍后重试。",
    short: "请把问题写得更具体一些（至少10个字符）。",
  },
};

export function QuestionForm({ locale, productId }: { locale: string; productId: string }) {
  const ui = STRINGS[locale] ?? STRINGS.ru;
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "short">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 10) {
      setState("short");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(`${apiBaseUrl()}/api/product-questions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, question: question.trim(), name: name.trim() || undefined, phone: phone.trim() || undefined }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-800">{ui.thanks}</div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-900">{ui.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{ui.sub}</p>
      <textarea
        value={question}
        onChange={(e) => { setQuestion(e.target.value); if (state === "short") setState("idle"); }}
        placeholder={ui.q}
        rows={3}
        required
        className="mt-3 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm"
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={ui.name} maxLength={120}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={ui.phone} maxLength={32} inputMode="tel"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
      </div>
      {state === "short" && <p className="mt-2 text-xs font-semibold text-amber-700">{ui.short}</p>}
      {state === "error" && <p className="mt-2 text-xs font-semibold text-rose-600">{ui.err}</p>}
      <button type="submit" disabled={state === "sending"}
        className="mt-3 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700 disabled:opacity-60">
        {state === "sending" ? ui.sending : ui.send}
      </button>
    </form>
  );
}
