"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { clearToken, getToken } from "@/lib/api";
import { apiFetch } from "@/lib/api";

function adminChatSocketUrl() {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"}/admin-chat`;
}

const links = [
  { href: "/dashboard", label: "Панель" },
  { href: "/site", label: "Сайт" },
  { href: "/categories", label: "Категории товаров" },
  { href: "/brands", label: "Бренды" },
  { href: "/partners", label: "Партнеры" },
  { href: "/certificates", label: "Сертификаты" },
  { href: "/products", label: "Продукты" },
  { href: "/orders", label: "Заказы" },
  { href: "/admin/service-requests", label: "Заявки" },
  { href: "/chat", label: "Чат" },
  { href: "/feedback", label: "Обратная связь" },
  { href: "/news", label: "Новости" },
  { href: "/solution-categories", label: "Категории решений" },
  { href: "/services", label: "Решения" },
  { href: "/portfolio", label: "Портфолио" }
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [newOrders, setNewOrders] = useState<number>(0);
  const [newFeedback, setNewFeedback] = useState<number>(0);
  const [pendingServiceRequests, setPendingServiceRequests] = useState<number>(0);
  const prevNewOrdersRef = useRef<number | null>(null);
  const prevNewFeedbackRef = useRef<number | null>(null);
  const prevLastChatRef = useRef<string | null>(null);
  const chatNotifInitializedRef = useRef(false);
  const [openChats, setOpenChats] = useState<number>(0);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  const notificationsSupported = useMemo(() => {
    return typeof window !== "undefined" && "Notification" in window;
  }, []);

  useEffect(() => {
    if (!notificationsSupported) {
      setNotifPermission("unsupported");
      return;
    }
    setNotifPermission(Notification.permission);

    // Debug notification permission
    console.log('AdminNav: Notification permission:', Notification.permission);
  }, [notificationsSupported]);

  const setNotifPermissionState = useRef(setNotifPermission);
  setNotifPermissionState.current = setNotifPermission;

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const socket = io(adminChatSocketUrl(), {
      transports: ["polling"], // Force polling to avoid WebSocket issues
      auth: { token }
    });
    const showChatNotification = () => {
      console.log('showChatNotification called');
      if (typeof window === "undefined" || !("Notification" in window)) {
        console.log('Notification not supported');
        return;
      }
      const perm = Notification.permission;
      console.log('Current notification permission:', perm);
      if (perm === "granted") {
        console.log('Creating chat notification');
        const n = new Notification("Новое сообщение в чате", {
          body: "Поступило новое сообщение от клиента. Откройте раздел «Чат».",
          tag: `sat_chat_${Date.now()}`,
          requireInteraction: false,
          silent: false
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
        return;
      }
      if (perm === "default") {
        console.log('Requesting notification permission...');
        Notification.requestPermission().then((p) => {
          console.log('Permission request result:', p);
          setNotifPermissionState.current(p);
          if (p === "granted") {
            const n = new Notification("Новое сообщение в чате", {
              body: "Поступило новое сообщение от клиента. Откройте раздел «Чат».",
              tag: `sat_chat_${Date.now()}`,
              silent: false
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
      }
    };
    socket.on("admin:new_message", (p: { message?: { sender?: string } }) => {
      console.log('AdminNav received admin:new_message:', p);
      const fromUser = p?.message?.sender === "USER";
      if (!fromUser) return;
      console.log('Message from user detected, showing notification');
      showChatNotification();
    });

    // Service request notifications
    socket.on("admin:new_service_request", (p: { id: number; serviceName: string; phone: string; status: string }) => {
      console.log("=== ADMIN NAV SERVICE REQUEST ===");
      console.log("AdminNav received service request:", p);
      showServiceRequestNotification(p);
      console.log("=== END ADMIN NAV SERVICE REQUEST ===");
    });

    // Order notifications
    socket.on("admin:new_order", (p: { id: number; phone: string; totalAmount: number; currency: string }) => {
      showOrderNotification(p);
    });

    // Feedback notifications
    socket.on("admin:new_feedback", (p: { id: string | number; name: string | null; phone: string | null; message: string }) => {
      console.log("=== ADMIN NAV FEEDBACK ===");
      console.log("AdminNav received feedback:", p);
      showFeedbackNotification(p);
      console.log("=== END ADMIN NAV FEEDBACK ===");
    });

    const showOrderNotification = (order: { id: number; phone: string; totalAmount: number; currency: string }) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      const perm = Notification.permission;
      if (perm === "granted") {
        const n = new Notification("Новый заказ!", {
          body: `Телефон: ${order.phone}. Сумма: ${order.totalAmount} ${order.currency}`,
          tag: `sat_order_${order.id}`,
          requireInteraction: false,
          silent: false
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
        return;
      }
      if (perm === "default") {
        Notification.requestPermission().then((p) => {
          setNotifPermissionState.current(p);
          if (p === "granted") {
            const n = new Notification("Новый заказ!", {
              body: `Телефон: ${order.phone}. Сумма: ${order.totalAmount} ${order.currency}`,
              tag: `sat_order_${order.id}`,
              silent: false
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
      }
    };

    const showFeedbackNotification = (feedback: { id: string | number; name: string | null; phone: string | null; message: string }) => {
      console.log('showFeedbackNotification called');
      if (typeof window === "undefined" || !("Notification" in window)) {
        console.log('Notification not supported for feedback');
        return;
      }
      const perm = Notification.permission;
      console.log('Current notification permission for feedback:', perm);
      if (perm === "granted") {
        console.log('Creating feedback notification');
        const n = new Notification("Новое сообщение!", {
          body: `От: ${feedback.name || feedback.phone || 'Аноним'}. ${feedback.message.slice(0, 100)}...`,
          tag: `sat_feedback_${feedback.id}`,
          requireInteraction: false,
          silent: false
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
        return;
      }
      if (perm === "default") {
        console.log('Requesting notification permission for feedback...');
        Notification.requestPermission().then((p) => {
          console.log('Permission request result for feedback:', p);
          setNotifPermissionState.current(p);
          if (p === "granted") {
            const n = new Notification("Новое сообщение!", {
              body: `От: ${feedback.name || feedback.phone || 'Аноним'}. ${feedback.message.slice(0, 100)}...`,
              tag: `sat_feedback_${feedback.id}`,
              silent: false
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
      }
    };

    const showServiceRequestNotification = (request: { id: number; serviceName: string; phone: string; status: string }) => {
      console.log('showServiceRequestNotification called');
      if (typeof window === "undefined" || !("Notification" in window)) {
        console.log('Notification not supported for service request');
        return;
      }
      const perm = Notification.permission;
      console.log('Current notification permission for service request:', perm);
      if (perm === "granted") {
        console.log('Creating service request notification');
        const n = new Notification("Новая заявка на услугу!", {
          body: `Услуга: ${request.serviceName}. Телефон: ${request.phone}`,
          tag: `sat_service_request_${request.id}`,
          requireInteraction: false,
          silent: false
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
        return;
      }
      if (perm === "default") {
        console.log('Requesting notification permission for service request...');
        Notification.requestPermission().then((p) => {
          console.log('Permission request result for service request:', p);
          setNotifPermissionState.current(p);
          if (p === "granted") {
            const n = new Notification("Новая заявка на услугу!", {
              body: `Услуга: ${request.serviceName}. Телефон: ${request.phone}`,
              tag: `sat_service_request_${request.id}`,
              silent: false
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
      }
    };

    return () => {
      try {
        socket.close();
      } catch {
        // ignore
      }
    };
  }, [router]);

  useEffect(() => {
    let stopped = false;
    const tick = () => {
      apiFetch<{ newOrders: number; newFeedback?: number; openChats?: number; lastChatUserMessageAt?: string | null; pendingServiceRequests?: number }>("/admin/stats")
        .then((r) => {
          if (stopped) return;
          const next = r.newOrders ?? 0;
          const nextFeedback = r.newFeedback ?? 0;
          const nextOpenChats = r.openChats ?? 0;
          const nextLastChat = typeof r.lastChatUserMessageAt === "string" ? r.lastChatUserMessageAt : null;
          const nextPendingServiceRequests = r.pendingServiceRequests ?? 0;

          // Desktop notifications (only after first successful fetch).
          const prev = prevNewOrdersRef.current;
          prevNewOrdersRef.current = next;
          if (prev !== null && next > prev && notificationsSupported && Notification.permission === "granted") {
            const delta = next - prev;
            const n = new Notification("Новый заказ", {
              body: delta === 1 ? "Поступил новый заказ. Откройте раздел «Заказы»." : `Поступило новых заказов: ${delta}. Откройте раздел «Заказы».`,
              tag: "sat_new_order"
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

          const prevFb = prevNewFeedbackRef.current;
          prevNewFeedbackRef.current = nextFeedback;
          if (prevFb !== null && nextFeedback > prevFb && notificationsSupported && Notification.permission === "granted") {
            const delta = nextFeedback - prevFb;
            const n = new Notification("Новая обратная связь", {
              body: delta === 1 ? "Поступило новое сообщение. Откройте «Обратная связь»." : `Новых сообщений: ${delta}. Откройте «Обратная связь».`,
              tag: "sat_new_feedback"
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

          const prevChat = prevLastChatRef.current;
          prevLastChatRef.current = nextLastChat;
          const chatChanged = nextLastChat && nextLastChat !== prevChat;
          if (chatNotifInitializedRef.current && chatChanged && notificationsSupported && Notification.permission === "granted") {
            const n = new Notification("Новое сообщение в чате", {
              body: "Поступило новое сообщение. Откройте раздел «Чат».",
              tag: "sat_new_chat_message"
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
          chatNotifInitializedRef.current = true;

          setNewOrders(next);
          setNewFeedback(nextFeedback);
          setOpenChats(nextOpenChats);
          setPendingServiceRequests(nextPendingServiceRequests);
        })
        .catch(() => {
          if (stopped) return;
          setNewOrders(0);
          setNewFeedback(0);
          setOpenChats(0);
          setPendingServiceRequests(0);
          prevNewOrdersRef.current = null;
          prevNewFeedbackRef.current = null;
          prevLastChatRef.current = null;
          chatNotifInitializedRef.current = false;
        });
    };

    tick();
    const id = window.setInterval(tick, 3000);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
  }, [router, notificationsSupported]);

  async function enableNotifications() {
    if (!notificationsSupported) {
      setNotifPermission("unsupported");
      return;
    }
    try {
      const p = await Notification.requestPermission();
      setNotifPermission(p);
    } catch {
      setNotifPermission(Notification.permission);
    }
  }

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="w-[90%] mx-auto flex h-16 items-center justify-between gap-6">
        <Link href="/dashboard" prefetch={false} className="text-sm font-semibold">
          SAT Admin
        </Link>
        <nav className="hidden items-center gap-4 sm:flex">
          {links.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                prefetch={false}
                className={`text-sm font-medium ${active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{l.label}</span>
                  {l.href === "/orders" && newOrders > 0 ? (
                    <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {newOrders}
                    </span>
                  ) : null}
                  {l.href === "/admin/service-requests" && pendingServiceRequests > 0 ? (
                    <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {pendingServiceRequests}
                    </span>
                  ) : null}
                  {l.href === "/chat" && openChats > 0 ? (
                    <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {openChats}
                    </span>
                  ) : null}
                  {l.href === "/feedback" && newFeedback > 0 ? (
                    <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {newFeedback}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {notifPermission === "default" ? (
            <button
              type="button"
              onClick={() => void enableNotifications()}
              className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
              title="Разрешите уведомления — тогда Chrome будет показывать всплывающие уведомления о новых заказах, чате и обратной связи"
            >
              Уведомления: включить (для Chrome)
            </button>
          ) : null}
          {notifPermission === "denied" ? (
            <div className="hidden text-xs text-slate-500 lg:block" title="Разрешите уведомления в настройках сайта браузера">
              Уведомления: выключены
            </div>
          ) : null}

          <button
            onClick={() => {
              clearToken();
              router.replace("/login");
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

