"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Отметка «посетитель закрыл чат»: в localStorage — навсегда, sessionStorage —
// запасной вариант, если хранилище недоступно (приватный режим).
const DISMISS_KEY = "sat_chat_dismissed";
function chatDismissed() {
  try { if (localStorage.getItem(DISMISS_KEY) === "1") return true; } catch {}
  try { if (sessionStorage.getItem(DISMISS_KEY) === "1") return true; } catch {}
  return false;
}
import { useTranslations, useLocale } from "next-intl";
import type { Socket } from "socket.io-client";

const PHONE_OPTIONAL: Record<string, string> = { ru: "необязательно", uz: "ixtiyoriy", en: "optional", tr: "isteğe bağlı", zh: "可选" };
import { trackConversion } from "@/lib/gtag";

type Msg = {
  id: string;
  conversationId: string;
  sender: "USER" | "ADMIN";
  text: string;
  createdAt: string | Date;
};

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
}

function safeNowId() {
  try {
    const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getVisitorId() {
  if (typeof window === "undefined") return "";
  const key = "sat_chat_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing && existing.length >= 10) return existing;
  const next = `v_${safeNowId()}`;
  window.localStorage.setItem(key, next);
  return next;
}

function clearVisitorId() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("sat_chat_visitor_id");
  } catch {
    // ignore
  }
}

type Profile = { name: string; phone: string };

function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const name = window.localStorage.getItem("sat_chat_name") || "";
    const phone = window.localStorage.getItem("sat_chat_phone") || "";
    // Телефон необязателен: достаточно имени, чтобы начать чат.
    if (name.trim()) return { name: name.trim(), phone: phone.trim() };
  } catch {
    // ignore
  }
  return null;
}

function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("sat_chat_name", p.name);
    window.localStorage.setItem("sat_chat_phone", p.phone);
  } catch {
    // ignore
  }
}

// Первое касание: запоминаем UTM/gclid из URL входа, чтобы знать, какая реклама привела клиента
function firstTouchUtm(): string {
  try {
    const sp = new URLSearchParams(window.location.search);
    // gad_campaignid/yclid — чтобы бот в теме менеджеров показывал кампанию/Яндекс по имени
    const keys = ["utm_source", "utm_medium", "utm_campaign", "gclid", "gad_campaignid", "yclid"];
    const cur = keys.filter((k) => sp.get(k)).map((k) => `${k}=${sp.get(k)}`).join("&");
    if (cur && !localStorage.getItem("first_utm")) localStorage.setItem("first_utm", cur.slice(0, 300));
    return localStorage.getItem("first_utm") || "";
  } catch {
    return "";
  }
}

function currentPage(): string {
  if (typeof window === "undefined") return "";
  try {
    const utm = firstTouchUtm();
    return (window.location.pathname || "/") + (utm ? ` | ${utm}` : "");
  } catch {
    return "";
  }
}

const GREETING =
  "Здравствуйте! 👋 Я консультант SAT Solutions. Подскажу по видеонаблюдению, СКУД, сигнализации и другим системам. Чем помочь?";

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

function fmtTime(d: any) {
  try {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function ChatWidget() {
  const tw = useTranslations("chat");
  const tcc = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationStatus, setConversationStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhoneRest, setFormPhoneRest] = useState("");
  const profileRef = useRef<Profile | null>(null);
  profileRef.current = profile;

  const listRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const openRef = useRef(false);
  const originalTitleRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimePendingRef = useRef(false);
  openRef.current = open;


  const canSend = useMemo(() => {
    return connected && !!profile && draft.trim().length > 0 && draft.trim().length <= 2000;
  }, [connected, profile, draft]);

  function scrollToBottom() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    if (!open) return;
    scrollToBottom();
  }, [open, messages.length]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Load saved visitor profile (name + phone) once on mount.
  useEffect(() => {
    setProfile(getProfile());
  }, []);

  // Soft two-note chime via Web Audio. Returns true if it actually played
  // (audio is unlocked); false if the browser still blocks autoplay.
  function tryChime(): boolean {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
      if (!AC) return true; // no audio support — give up gracefully
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume().catch(() => {});
      if (ctx.state !== "running") return false; // not unlocked yet — try on next gesture
      const now = ctx.currentTime;
      [{ f: 880, t: 0 }, { f: 1174.7, t: 0.12 }].forEach(({ f, t }) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + t);
        g.gain.exponentialRampToValueAtTime(0.05, now + t + 0.02); // мягкая громкость
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.28);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + t);
        o.stop(now + t + 0.32);
      });
      return true;
    } catch {
      return true;
    }
  }

  // Автооткрытие чата. Правила (решение руководства 03.08.2026, уточнено 21.08.2026):
  // — на телефоне сами не открываемся вовсе: окно занимало нижние 55% экрана,
  //   и первый тап по ссылке или кнопке уходил в чат, а не на страницу;
  //   посетитель открывает чат кнопкой в углу;
  // — на компьютере даём прочитать страницу и открываемся через 12 с;
  // — если посетитель хоть раз закрыл чат, сами больше не открываемся никогда:
  //   отметка живёт в localStorage и переживает перезагрузку и новый визит.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (chatDismissed()) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const timer = window.setTimeout(() => setOpen(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);

  const closeChat = () => {
    setOpen(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch {}
  };

  // Play the chime whenever the chat opens (auto or manual). If audio isn't unlocked yet,
  // it stays pending and fires on the visitor's first real gesture (see the listener below).
  useEffect(() => {
    if (!open) return;
    chimePendingRef.current = true;
    if (tryChime()) chimePendingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Greeting appears when the chat opens, then fades out after a few seconds.
  useEffect(() => {
    if (!open) {
      setShowGreeting(false);
      return;
    }
    setShowGreeting(true);
    const t = window.setTimeout(() => setShowGreeting(false), 6000);
    return () => window.clearTimeout(t);
  }, [open]);

  // Unlock audio + flush any pending chime on the first genuine user gesture.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onGesture = () => {
      if (chimePendingRef.current && tryChime()) chimePendingRef.current = false;
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, onGesture));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Socket connects ONLY when the widget is opened to avoid blocking BFcache for regular visits.
  useEffect(() => {
    if (!open) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }
    if (socketRef.current) return;

    setConnecting(true);
    setError(null);

    let socket: Socket | null = null;

    (async () => {
      try {
        const { io } = await import("socket.io-client");

        // Check if closed while importing
        if (!openRef.current) return;

        socket = io(apiBaseUrl(), {
          transports: ["websocket"],
          autoConnect: true,
          reconnection: true,
          closeOnBeforeunload: true
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
          setConnecting(false);
          setError(null);
          const p = profileRef.current;
          socket?.emit("chat:init", {
            visitorId: getVisitorId(),
            name: p?.name || null,
            phone: p?.phone ? `+998${digitsOnly(p.phone)}` : null,
            page: currentPage()
          });
        });

        socket.on("disconnect", () => {
          setConnected(false);
        });

        socket.on("connect_error", (e: any) => {
          setConnecting(false);
          setConnected(false);
          setError(e?.message ?? "Ошибка подключения");
        });

        socket.on("chat:error", (p: any) => {
          setError(p?.error ?? "Ошибка чата");
        });

        socket.on("chat:ready", (p: any) => {
          const cid = typeof p?.conversation?.id === "string" ? p.conversation.id : null;
          conversationIdRef.current = cid;
          setConversationId(cid);
          setConversationStatus(p?.conversation?.status === "CLOSED" ? "CLOSED" : "OPEN");
          const arr = Array.isArray(p?.messages) ? p.messages : [];
          setMessages(
            arr
              .map((m: any) => ({
                id: String(m.id ?? safeNowId()),
                conversationId: String(m.conversationId ?? cid ?? ""),
                sender: m.sender === "ADMIN" ? "ADMIN" : "USER",
                text: String(m.text ?? ""),
                createdAt: m.createdAt ?? new Date().toISOString()
              }))
              .filter((m: Msg) => m.conversationId || cid)
          );
          setError(null);
          window.setTimeout(scrollToBottom, 50);
        });

        socket.on("chat:status", (p: any) => {
          setConversationStatus(p?.status === "CLOSED" ? "CLOSED" : "OPEN");
        });

        socket.on("chat:reset", (p: any) => {
          const cid = String(p?.conversationId ?? "");
          if (!cid) return;
          const current = conversationIdRef.current;
          if (current && cid !== current) return;
          clearVisitorId();
          setConversationId(null);
          setConversationStatus("OPEN");
          setMessages([]);
          setDraft("");
          setError(null);
          setUnreadCount(0);
          if (typeof document !== "undefined" && originalTitleRef.current) {
            document.title = originalTitleRef.current;
            originalTitleRef.current = null;
          }
          try {
            const p = profileRef.current;
            socket?.emit("chat:init", {
              visitorId: getVisitorId(),
              name: p?.name || null,
              phone: p?.phone ? `+998${digitsOnly(p.phone)}` : null,
              page: currentPage()
            });
          } catch {
            // ignore
          }
        });

        socket.on("chat:message", (m: any) => {
          const cid = String(m?.conversationId ?? "");
          if (!cid) return;
          if (cid !== conversationIdRef.current) return;
          const isAdmin = m?.sender === "ADMIN";
          const text = String(m?.text ?? "");

          setMessages((prev) => {
            if (prev.some((x) => x.id === String(m?.id))) return prev;
            return [
              ...prev,
              {
                id: String(m?.id ?? safeNowId()),
                conversationId: cid,
                sender: isAdmin ? "ADMIN" : "USER",
                text,
                createdAt: m?.createdAt ?? new Date().toISOString()
              }
            ];
          });
          window.setTimeout(scrollToBottom, 50);

          // When widget is closed and admin replied: badge, desktop notification (title updated in effect below)
          if (isAdmin && !openRef.current) {
            setUnreadCount((n) => n + 1);
            console.log('ChatWidget: Admin message received, showing notification');
            if (typeof Notification !== "undefined") {
              console.log('ChatWidget: Notification API available, permission:', Notification.permission);
              if (Notification.permission === "granted") {
                try {
                  console.log('ChatWidget: Creating notification');
                  new Notification("Новое сообщение в чате", {
                    body: text.length > 80 ? text.slice(0, 80) + "…" : text,
                    icon: "/favicon.ico",
                    tag: `chat-${cid}-${m?.id ?? Date.now()}`
                  });
                } catch (error) {
                  console.error('ChatWidget: Error creating notification:', error);
                }
              } else if (Notification.permission === "default") {
                console.log('ChatWidget: Requesting notification permission...');
                Notification.requestPermission().then((permission) => {
                  console.log('ChatWidget: Permission request result:', permission);
                  // Next admin message will show notification if granted
                });
              }
            } else {
              console.log('ChatWidget: Notification API not available');
            }
          }
        });

      } catch (err) {
        console.error("Failed to load socket.io-client", err);
        setConnecting(false);
      }
    })();

    const onPageHide = () => {
      if (socketRef.current) socketRef.current.close();
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [open]);

  // When opening widget: clear unread and restore document title
  useEffect(() => {
    if (!open) return;
    setUnreadCount(0);
    if (typeof document !== "undefined" && originalTitleRef.current) {
      document.title = originalTitleRef.current;
      originalTitleRef.current = null;
    }
  }, [open]);

  // Sync document title with unread count when widget is closed
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (unreadCount > 0 && !open) {
      if (!originalTitleRef.current) originalTitleRef.current = document.title;
      document.title = `(${unreadCount}) Новое сообщение в чате`;
    } else if (unreadCount === 0 && originalTitleRef.current) {
      document.title = originalTitleRef.current;
      originalTitleRef.current = null;
    }
  }, [unreadCount, open]);

  async function send() {
    if (!canSend) return;
    const text = draft.trim();
    setDraft("");
    setError(null);
    const socket = socketRef.current;
    if (!socket) return;
    const p = profileRef.current;
    const extra = {
      name: p?.name || null,
      phone: p?.phone ? `+998${digitsOnly(p.phone)}` : null,
      page: currentPage()
    };
    if (conversationId) {
      socket.emit("chat:send", { conversationId, text, ...extra });
    } else {
      socket.emit("chat:send", { visitorId: getVisitorId(), text, ...extra });
    }
  }

  function submitProfile() {
    const name = formName.trim();
    const phoneRest = digitsOnly(formPhoneRest);
    // Телефон необязателен — достаточно имени. Если телефон есть (9 цифр) — прикладываем к конверсии.
    if (name.length < 2) return;
    const p: Profile = { name, phone: phoneRest };
    // Лид из онлайн-чата — конверсия в Google Ads (только при первом заполнении профиля).
    if (!profileRef.current) trackConversion("chat", phoneRest.length >= 9 ? { user: { phone: `+998${phoneRest}` } } : undefined);
    saveProfile(p);
    setProfile(p);
    // Re-announce profile so an existing conversation gets the name/phone attached.
    const socket = socketRef.current;
    if (socket && connected) {
      socket.emit("chat:init", {
        visitorId: getVisitorId(),
        name: p.name,
        phone: `+998${p.phone}`,
        page: currentPage()
      });
    }
  }

  return (
    <div className="fixed z-[60] bottom-4 right-4 sm:bottom-[40px] sm:right-[40px]">
      {open ? (
        <div className="w-[92vw] max-w-sm overflow-hidden rounded-2xl border-2 border-brand-600 bg-white shadow-2xl ring-4 ring-brand-600/15">
          <div className="flex items-center justify-between gap-3 bg-brand-600 px-4 py-3 text-white">
            <div className="min-w-0">
              <div className="text-sm font-bold">{tw("title")}</div>
              <div className="flex items-center gap-1.5 text-xs text-white/90">
                <span className={`inline-block h-2 w-2 rounded-full ${connected ? "bg-emerald-300" : "bg-amber-300"}`} />
                {connecting ? tw("connecting") : connected ? tw("online") : tw("offline")}
              </div>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="rounded-lg bg-white/15 px-2 py-1 text-sm font-semibold text-white hover:bg-white/25"
              aria-label={tw("close")}
            >
              ✕
            </button>
          </div>

          <div
            className={`overflow-hidden bg-white px-4 transition-all duration-700 ease-in-out ${showGreeting ? "max-h-56 pt-4 opacity-100" : "max-h-0 pt-0 opacity-0"}`}
          >
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-900">
                {tw("greeting")}
              </div>
            </div>
          </div>

          {!profile ? (
            <div className="space-y-3 bg-white p-4">
              <div className="text-sm text-slate-700">
                {tw("intro")}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{tw("name")}</div>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600"
                  placeholder={tw("yourName")}
                />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{tw("phone")} <span className="font-normal text-slate-400">({PHONE_OPTIONAL[locale] ?? PHONE_OPTIONAL.ru})</span></div>
                <div className="mt-1 flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-600">
                  <div className="flex items-center bg-slate-100 px-3 text-sm font-bold text-slate-900">+998</div>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formatUzRest(formPhoneRest)}
                    onChange={(e) => setFormPhoneRest(digitsOnly(e.target.value).slice(0, 9))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitProfile();
                      }
                    }}
                    className="w-full px-3 py-2 text-sm outline-none"
                    placeholder="90 123 45 67"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={submitProfile}
                disabled={formName.trim().length < 2}
                className="w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {tw("start")}
              </button>
            </div>
          ) : (
            <>
              <div ref={listRef} className="max-h-[50vh] space-y-2 overflow-y-auto bg-white p-4">
                {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</div> : null}
                {conversationStatus === "CLOSED" ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                    {tw("closed")}
                  </div>
                ) : null}
                {messages.map((m) => {
                  const mine = m.sender === "USER";
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-900"
                          }`}
                      >
                        <div className="whitespace-pre-wrap">{m.text}</div>
                        <div className={`mt-1 text-[11px] ${mine ? "text-white/80" : "text-slate-500"}`}>{fmtTime(m.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 bg-white p-3">
                <div className="flex items-center gap-2">
                  <input
                    name="message"
                    autoComplete="off"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void send();
                      }
                    }}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder={tw("placeholder")}
                  />
                  <button
                    type="button"
                    onClick={() => void send()}
                    disabled={!canSend}
                    aria-label={tw("send")}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Отправить
                  </button>
                </div>
                <div className="mt-1 text-xs text-slate-500">{tcc("chatRealtime")}</div>
              </div>
            </>
          )}
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700"
          aria-label={unreadCount > 0 ? `Открыть чат (${unreadCount} новых)` : "Открыть чат"}
          title={unreadCount > 0 ? `Новое сообщение в чате (${unreadCount})` : "Онлайн чат"}
        >
          💬
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      ) : null}
    </div>
  );
}

