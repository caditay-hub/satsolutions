import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServiceCategories, getServices } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const categories = await getServiceCategories();
    const category = categories?.items.find((c) => c.slug === slug);

    if (!category) return { title: "Решения" };

    return {
        title: `${category.name} | Решения`,
        description: category.description1 || `Решения Dahua для категории ${category.name}`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const [categoriesData, servicesData] = await Promise.all([
        getServiceCategories(),
        getServices(1, 100, { category: slug }),
    ]);

    const category = categoriesData?.items.find((c) => c.slug === slug);
    const solutions = servicesData?.items || [];

    if (!category) {
        notFound();
    }

    return (
        <div className="bg-white font-main min-h-screen">

            {/* Hero Banner */}
            <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <Image
                    src={resolveImageUrl(category.imageUrl) || "/placeholder.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover brightness-50"
                    priority
                    unoptimized
                />
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 drop-shadow-lg">
                        {category.name}
                    </h1>
                    {category.description1 && (
                        <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md leading-relaxed opacity-90 text-left md:text-center">
                            {category.description1}
                        </p>
                    )}
                </div>
            </div>

            <div className="container-page py-10 md:py-20">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm md:text-base font-bold uppercase tracking-wide text-slate-400 mb-12">
                    <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href="/solutions" className="hover:text-slate-900 transition-colors">Решения</Link>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-slate-900 truncate max-w-[300px]">{category.name}</span>
                </nav>

                {/* Introduction / Description 2 */}
                {category.description2 && (
                    <div className="max-w-4xl mb-20">
                        <p className="text-slate-600 text-base md:text-lg leading-loose text-left">
                            {category.description2}
                        </p>
                    </div>
                )}

                {/* Solutions Grid */}
                <div className="mb-12 border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter text-left">
                        Решения в категории &laquo;{category.name}&raquo;
                    </h2>
                </div>

                {solutions.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {solutions.map((solution) => (
                            <Link
                                key={solution.id}
                                href={`/solutions/${solution.slug}`}
                                className="group flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-300"
                            >
                                {/* Card Image */}
                                <div className="relative aspect-video overflow-hidden bg-slate-100 rounded-t-xl group-hover:rounded-t-xl">
                                    <Image
                                        src={resolveImageUrl(solution.coverImageUrl || solution.overviewImageUrl) || "/placeholder.jpg"}
                                        alt={solution.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        unoptimized
                                    />
                                    {/* Overlay gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                                </div>

                                {/* Card Content */}
                                <div className="flex flex-col flex-1 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-left">
                                        {solution.title}
                                    </h3>

                                    {solution.excerpt && (
                                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed text-left mb-6">
                                            {solution.excerpt}
                                        </p>
                                    )}

                                    {/* 'Learn More' Button */}
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between group-hover:border-slate-200 transition-colors">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                                            Узнать больше
                                        </span>
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">В этой категории пока нет решений</p>
                        <Link href="/solutions" className="inline-block mt-4 text-sm font-bold text-blue-600 hover:underline">
                            Вернуться ко всем решениям
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
