import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Страница не найдена</h1>
      <p className="mt-2 text-sm text-slate-600">Возможно, ссылка неверная или страница была удалена.</p>
      <div className="mt-6">
        <Link href="/" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          На главную →
        </Link>
      </div>
    </div>
  );
}

