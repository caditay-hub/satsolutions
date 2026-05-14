import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <h1 className="text-2xl font-semibold">Страница не найдена</h1>
      <p className="mt-2 text-sm text-slate-600">Страница админ‑панели не найдена.</p>
      <div className="mt-6">
        <Link href="/dashboard" className="text-sm font-semibold text-slate-900 hover:underline">
          Панель →
        </Link>
      </div>
    </div>
  );
}

