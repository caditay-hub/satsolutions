"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

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

function fmtTime(d: any) {
  try {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationStatus, setConversationStatus] = useState<"OPEN" | "CLOSED">("OPEN");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const listRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const openRef = useRef(false);
  const originalTitleRef = useRef<string | null>(null);
  openRef.current = open;


  const canSend = useMemo(() => {
    return connected && conversationStatus === "OPEN" && draft.trim().length > 0 && draft.trim().length <= 2000;
  }, [connected, conversationStatus, draft]);

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
          socket?.emit("chat:init", { visitorId: getVisitorId() });
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
            socket?.emit("chat:init", { visitorId: getVisitorId() });
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
    if (conversationId) {
      socket.emit("chat:send", { conversationId, text });
    } else {
      socket.emit("chat:send", { visitorId: getVisitorId(), text });
    }
  }

  return (
    <div className="fixed z-[60] bottom-4 right-4 sm:bottom-[40px] sm:right-[40px]">
      {open ? (
        <div className="w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">Онлайн чат</div>
              <div className="text-xs text-slate-600">
                {connecting ? "Подключение..." : connected ? "Оператор онлайн" : "Оффлайн"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm font-semibold hover:bg-slate-50"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>

          <div ref={listRef} className="max-h-[50vh] space-y-2 overflow-y-auto bg-white p-4">
            {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</div> : null}
            {conversationStatus === "CLOSED" ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                Чат завершен администратором. Если нужно — отправьте заявку через «Обратная связь».
              </div>
            ) : null}
            {messages.length === 0 ? (
              <div className="text-sm text-slate-600">
                Напишите сообщение — оператор ответит вам.
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
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void send();
                  }
                }}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Введите сообщение..."
                disabled={conversationStatus !== "OPEN"}
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={!canSend}
                aria-label="Отправить сообщение"
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Отправить
              </button>
            </div>
            <div className="mt-1 text-xs text-slate-500">Чат работает в реальном времени.</div>
          </div>
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

