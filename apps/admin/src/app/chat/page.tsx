"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { getToken } from "@/lib/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
}

type Conv = {
  id: string;
  visitorId: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  status: "OPEN" | "CLOSED";
  unreadCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  lastMessage: { id: string; sender: "USER" | "ADMIN"; text: string; createdAt: string } | null;
};

type Msg = {
  id: string;
  conversationId: string;
  sender: "USER" | "ADMIN";
  text: string;
  createdAt: string;
};

function clip(s: string, n = 60) {
  const t = (s ?? "").toString().trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n - 1)}…`;
}

export default function AdminChatPage() {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const active = useMemo(() => convs.find((c) => c.id === activeId) ?? null, [convs, activeId]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("Нет токена. Перезайдите в админ.");
      return;
    }

    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"}/admin-chat`, {
      transports: ["polling"], // Force polling to avoid WebSocket issues
      auth: { token }
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError(null);
      socket.emit("admin:list");
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (e: any) => setError(e?.message ?? "Ошибка подключения"));

    socket.on("admin:list", (items: Conv[]) => {
      const arr = Array.isArray(items) ? items : [];
      setConvs(arr);
      if (!activeId && arr[0]?.id) setActiveId(arr[0].id);
    });

    socket.on("admin:conversation_new", (c: Conv) => {
      if (!c?.id) return;
      setConvs((prev) => {
        if (prev.some((x) => x.id === c.id)) return prev;
        const createdAt = typeof c.createdAt === "string" ? c.createdAt : (c as any).createdAt ? String((c as any).createdAt) : new Date().toISOString();
        const item: Conv = {
          id: c.id,
          visitorId: c.visitorId ?? "",
          name: c.name ?? null,
          phone: c.phone ?? null,
          email: c.email ?? null,
          status: (c.status === "CLOSED" ? "CLOSED" : "OPEN") as "OPEN" | "CLOSED",
          unreadCount: c.unreadCount ?? 0,
          lastMessageAt: c.lastMessageAt ?? null,
          createdAt,
          lastMessage: c.lastMessage ?? null
        };
        return [item, ...prev];
      });
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Новый чат", {
          body: "Клиент открыл чат. Откройте раздел «Чат».",
          tag: "sat_new_chat"
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {
            // ignore
          }
          router.push("/chat");
          n.close();
        };
      }
    });

    socket.on("admin:conversation_update", (p: any) => {
      const id = String(p?.id ?? "");
      if (!id) return;
      setConvs((prev) => prev.map((c) => (c.id === id ? {
        ...c,
        status: p?.status ?? c.status,
        unreadCount: typeof p?.unreadCount === "number" ? p.unreadCount : c.unreadCount
      } : c)));
    });

    socket.on("admin:conversation_reset", (p: any) => {
      const id = String(p?.id ?? "");
      if (!id) return;
      setConvs((prev) => prev.filter((c) => c.id !== id));
      if (activeIdRef.current === id) {
        setActiveId(null);
        setMessages([]);
      }
    });

    socket.on("admin:new_message", (p: any) => {
      const cid = String(p?.conversationId ?? "");
      const m = p?.message;
      const unreadCount = p?.unreadCount;
      if (!cid || !m) return;
      setConvs((prev) => {
        const sender: "USER" | "ADMIN" = m?.sender === "ADMIN" ? "ADMIN" : "USER";
        const createdAt = m?.createdAt ? String(m.createdAt) : "";
        const next = prev.map((c) =>
          c.id === cid
            ? {
              ...c,
              lastMessageAt: createdAt || c.lastMessageAt,
              lastMessage: { id: String(m.id), sender, text: String(m.text ?? ""), createdAt },
              unreadCount: typeof unreadCount === "number" ? unreadCount : c.unreadCount
            }
            : c
        );
        // move updated conversation to top
        next.sort((a, b) => String(b.lastMessageAt ?? b.createdAt).localeCompare(String(a.lastMessageAt ?? a.createdAt)));
        return next;
      });
    });

    socket.on("admin:messages", (items: Msg[]) => {
      setMessages(Array.isArray(items) ? items : []);
      window.setTimeout(() => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    });

    socket.on("chat:message", (m: any) => {
      const msg: Msg = {
        id: String(m?.id ?? ""),
        conversationId: String(m?.conversationId ?? ""),
        sender: m?.sender === "ADMIN" ? "ADMIN" : "USER",
        text: String(m?.text ?? ""),
        createdAt: String(m?.createdAt ?? "")
      };
      if (!msg.id || !msg.conversationId) return;

      // Only append to open chat if it's the active conversation; otherwise just update list.
      if (msg.conversationId === activeIdRef.current) {
        setMessages((prev) => {
          if (prev.some((x) => x.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }

      setConvs((prev) => {
        const next = prev.map((c) =>
          c.id === msg.conversationId
            ? { ...c, lastMessageAt: msg.createdAt ?? c.lastMessageAt, lastMessage: { id: msg.id, sender: msg.sender, text: msg.text, createdAt: msg.createdAt } }
            : c
        );
        next.sort((a, b) => String(b.lastMessageAt ?? b.createdAt).localeCompare(String(a.lastMessageAt ?? a.createdAt)));
        return next;
      });

      if (msg.conversationId === activeIdRef.current) {
        window.setTimeout(() => {
          const el = listRef.current;
          if (el) el.scrollTop = el.scrollHeight;
        }, 20);
      }
    });

    // Listen for new orders
    socket.on("admin:new_order", (order: any) => {
      console.log("New order received:", order);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Новый заказ!", {
          body: `Телефон: ${order.phone}. Сумма: ${order.totalAmount} ${order.currency}`,
          tag: `order_${order.id}`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {
            // ignore
          }
          router.push("/orders");
          n.close();
        };
      }
    });

    // Listen for new feedback
    socket.on("admin:new_feedback", (feedback: any) => {
      console.log("New feedback received:", feedback);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Новое сообщение!", {
          body: `От: ${feedback.name || feedback.phone || 'Аноним'}. ${feedback.message.slice(0, 100)}...`,
          tag: `feedback_${feedback.id}`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {
            // ignore
          }
          router.push("/feedback");
          n.close();
        };
      }
    });

    // Listen for new service requests
    socket.on("admin:new_service_request", (request: any) => {
      console.log("Chat received new service request:", request);
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Новая заявка на услугу!", {
          body: `Услуга: ${request.serviceName}. Телефон: ${request.phone}`,
          tag: `service_request_${request.id}`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {
            // ignore
          }
          router.push("/admin/service-requests");
          n.close();
        };
      }
    });

    return () => {
      socketRef.current = null;
      try {
        socket.close();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeId) return;
    socket.emit("admin:join", { conversationId: activeId });
  }, [activeId]);

  async function send() {
    const socket = socketRef.current;
    if (!socket || !activeId) return;
    if (active?.status !== "OPEN") return;
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    socket.emit("admin:send", { conversationId: activeId, text });
  }

  function setStatus(status: "OPEN" | "CLOSED") {
    const socket = socketRef.current;
    if (!socket || !activeId) return;
    socket.emit("admin:set_status", { conversationId: activeId, status });
    setConvs((prev) => prev.map((c) => (c.id === activeId ? { ...c, status } : c)));
  }

  function resetConversation() {
    const socket = socketRef.current;
    if (!socket || !activeId) return;
    socket.emit("admin:reset", { conversationId: activeId });
    setConvs((prev) => prev.map((c) => (c.id === activeId ? { ...c, status: "CLOSED" } : c)));
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Чат</h1>
            <p className="mt-1 text-sm text-slate-600">{connected ? "Подключено" : "Отключено"}</p>
          </div>
        </div>

        <ConfirmDialog
          open={confirmClose}
          title="Завершить чат?"
          description="Этот диалог будет полностью удален из списка, и история сообщений будет очищена."
          onClose={() => setConfirmClose(false)}
          onConfirm={() => {
            setConfirmClose(false);
            setStatus("CLOSED");
          }}
        />



        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[360px_1fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Диалоги</div>
            <div className="max-h-[70vh] overflow-y-auto">
              {convs.map((c) => {
                const isActive = c.id === activeId;
                const title = c.name || c.phone || c.email || c.visitorId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${isActive ? "bg-slate-50" : "bg-white"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
                          {c.unreadCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                              {c.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-slate-600">
                          {c.lastMessage ? `${c.lastMessage.sender === "USER" ? "Клиент" : "Админ"}: ${clip(c.lastMessage.text)}` : "Нет сообщений"}
                        </div>
                      </div>
                      <div className="text-[10px] font-medium text-slate-400">{c.status}</div>
                    </div>
                  </button>
                );
              })}
              {convs.length === 0 ? <div className="p-4 text-sm text-slate-600">Пока нет диалогов.</div> : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  {active ? `Диалог: ${active.name || active.phone || active.email || active.visitorId}` : "Выберите диалог"}
                  {active ? <span className="ml-2 text-xs font-semibold text-slate-500">({active.status})</span> : null}
                </div>
                {active ? (
                  <div className="flex items-center gap-2">
                    {active.status === "OPEN" ? (
                      <button
                        type="button"
                        onClick={() => setConfirmClose(true)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Завершить чат
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setStatus("OPEN")}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                      >
                        Открыть снова
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div ref={listRef} className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {messages.map((m) => {
                const mine = m.sender === "ADMIN";
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}>
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div className={`mt-1 text-[11px] ${mine ? "text-white/75" : "text-slate-500"}`}>{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 ? <div className="text-sm text-slate-600">Сообщений нет.</div> : null}
              {active?.status === "CLOSED" ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  Чат завершен. Можно открыть снова, если нужно.
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-200 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void send();
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Ответить клиенту..."
                  disabled={!activeId || active?.status !== "OPEN"}
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={!activeId || active?.status !== "OPEN" || !draft.trim()}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  Отправить
                </button>
              </div>
              <div className="mt-1 text-xs text-slate-500">Сообщения приходят в реальном времени.</div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}

