"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken, type LoginResponse } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@satsolutions.local");
  const [password, setPassword] = useState("Admin12345!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(data.accessToken);
      router.replace("/dashboard");
    } catch {
      setError("Ошибка входа. Неверный email или пароль.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container-page flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold">SAT Admin</div>
          <p className="mt-1 text-sm text-slate-600">Вход через JWT.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <div className="text-sm font-medium text-slate-700">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                type="email"
                required
              />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-slate-700">Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                type="password"
                required
              />
            </label>
            {error ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
            <button
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Подождите..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

