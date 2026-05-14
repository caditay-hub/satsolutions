import Link from "next/link";
import type { Metadata } from "next";
import { getServices, getServiceCategories } from "@/lib/api";
import { DahuaSolutionsGrid } from "@/components/DahuaSolutionsGrid";

export const metadata: Metadata = {
  title: "Решения",
  description: "Комплексные технологические решения Dahua"
};

export default async function SolutionsPage() {
  const [cats, servs] = await Promise.all([
    getServiceCategories(),
    getServices(1, 100, { topOnly: true })
  ]);

  const categories = cats?.items?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) || [];
  const services = servs?.items || [];

  return (
    <div className="bg-white font-main min-h-screen">
      <div className="container-page pt-10 pb-20">

        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-10">
          <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900">Решения</span>
        </nav>

        <div className="max-w-4xl mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 uppercase italic tracking-tighter">
            Решения
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-loose font-medium max-w-5xl">
            Dahua, ведущий в мире поставщик решений для безопасности, предлагает комплексные решения для различных сфер и областей.
          </p>
        </div>

        <div className="mb-12 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
            Решения для разных сфер
          </h2>
        </div>

        {/* Using Named Import to fix Webpack module resolution error 'undefined reading call' */}
        <DahuaSolutionsGrid
          categoriesData={JSON.stringify(categories)}
          servicesData={JSON.stringify(services)}
        />

        <div className="mt-32">
          <div className="mb-12 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              Решение SMB, сценарии
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden bg-slate-100 rounded-sm aspect-[21/9] flex items-end p-8">
              <div className="absolute inset-0 bg-black/30" />
              <h3 className="text-white font-black uppercase italic tracking-tighter text-xl relative z-10">
                Малый и средний бизнес
              </h3>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
