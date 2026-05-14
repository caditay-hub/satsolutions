"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type CategoryDto } from "@/lib/api";
import { getToken } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<{ 
    products: number; 
    news: number; 
    categories: number;
    orders: number;
    newOrders: number;
    newFeedback: number;
    serviceRequests: number;
    openChats: number;
  } | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    apiFetch<{ 
      categories: number; 
      products: number; 
      news: number; 
      users: number;
      orders: number;
      newOrders: number;
      newFeedback: number;
      openChats: number;
    }>("/admin/stats")
      .then((r) => setStats({ 
        categories: r.categories, 
        products: r.products, 
        news: r.news,
        orders: r.orders,
        newOrders: r.newOrders,
        newFeedback: r.newFeedback,
        serviceRequests: 0, // Will be updated separately
        openChats: r.openChats
      }))
      .catch(() => setStats({ 
        categories: 0, 
        products: 0, 
        news: 0,
        orders: 0,
        newOrders: 0,
        newFeedback: 0,
        serviceRequests: 0,
        openChats: 0
      }));
  }, []);

  useEffect(() => {
    apiFetch<{ categories: CategoryDto[] }>("/admin/categories")
      .then((r) => setCategories(r.categories))
      .catch(() => setCategories([]));
  }, []);

  // Fetch service requests count
  useEffect(() => {
    apiFetch<{ items: any[]; total: number }>("/admin/service-requests?limit=1")
      .then((r) => setStats(prev => prev ? { ...prev, serviceRequests: r.total } : null))
      .catch(() => {});
  }, []);

  // Socket connection for real-time notifications
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"}/admin-chat`, {
      transports: ["polling"], // Force polling to avoid WebSocket issues
      auth: { token }
    });

    // Listen for new orders
    socket.on("admin:new_order", (order: any) => {
      console.log("Dashboard received new order:", order);
      setStats(prev => prev ? { ...prev, newOrders: prev.newOrders + 1, orders: prev.orders + 1 } : null);
      
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Новый заказ!", {
          body: `Телефон: ${order.phone}. Сумма: ${order.totalAmount} ${order.currency}`,
          tag: `dashboard_order_${order.id}`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {
            // ignore
          }
          window.location.href = "/orders";
          n.close();
        };
      }
    });

    // Listen for new feedback
    socket.on("admin:new_feedback", (feedback: any) => {
      console.log("Dashboard received new feedback:", feedback);
      setStats(prev => prev ? { ...prev, newFeedback: prev.newFeedback + 1 } : null);
      
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Новое сообщение!", {
          body: `От: ${feedback.name || feedback.phone || 'Аноним'}. ${feedback.message.slice(0, 100)}...`,
          tag: `dashboard_feedback_${feedback.id}`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {
            // ignore
          }
          window.location.href = "/feedback";
          n.close();
        };
      }
    });

    // Listen for new service requests
    socket.on("admin:new_service_request", (request: any) => {
      console.log("=== DASHBOARD SERVICE REQUEST ===");
      console.log("Dashboard received new service request:", request);
      setStats(prev => prev ? { ...prev, serviceRequests: prev.serviceRequests + 1 } : null);
      
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification("Новая заявка на услугу!", {
          body: `Услуга: ${request.serviceName}. Телефон: ${request.phone}`,
          tag: `dashboard_service_request_${request.id}`
        });
        n.onclick = () => {
          try {
            window.focus();
          } catch {
            // ignore
          }
          window.location.href = "/admin/service-requests";
          n.close();
        };
        console.log("Dashboard notification shown for service request");
      } else {
        console.log("Dashboard notification not shown - permission:", typeof window !== "undefined" && "Notification" in window ? Notification.permission : "No Notification API");
      }
      console.log("=== END DASHBOARD SERVICE REQUEST ===");
    });

    return () => {
      try {
        socket.close();
      } catch {
        // ignore
      }
    };
  }, []);

  function resolveImageUrl(url: string | null) {
    if (!url) return null;
    if (url.startsWith("/")) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      return `${base}${url}`;
    }
    return url;
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <h1 className="text-2xl font-semibold">Панель</h1>
        <p className="mt-1 text-sm text-slate-600">Краткая статистика.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Продукты", value: stats?.products ?? "…" },
            { label: "Новости", value: stats?.news ?? "…" },
            { label: "Категории", value: stats?.categories ?? "…" },
            { label: "Заказы", value: stats?.orders ?? "…" }
          ].map((x) => (
            <div key={x.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-600">{x.label}</div>
              <div className="mt-2 text-2xl font-semibold">{x.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Новые заказы", value: stats?.newOrders ?? "…", color: "text-red-600" },
            { label: "Новые сообщения", value: stats?.newFeedback ?? "…", color: "text-red-600" },
            { label: "Заявки на услуги", value: stats?.serviceRequests ?? "…", color: "text-blue-600" },
            { label: "Открытые чаты", value: stats?.openChats ?? "…", color: "text-green-600" }
          ].map((x) => (
            <div key={x.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-600">{x.label}</div>
              <div className={`mt-2 text-2xl font-semibold ${x.color}`}>{x.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold">Категории</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((c) => (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="h-40 w-full bg-slate-100">
                  {resolveImageUrl(c.coverImageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveImageUrl(c.coverImageUrl)!} alt={c.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="mt-1 text-xs text-slate-600">{c.slug}</div>
                </div>
              </div>
            ))}
            {categories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                Категорий пока нет. Добавьте их в разделе «Категории».
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AuthGate>
  );
}

