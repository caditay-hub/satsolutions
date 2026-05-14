"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/image";

function GridCard({ href, imageSrc, imageAlt, label }: { href: string; imageSrc: string; imageAlt: string; label: string }) {
    return (
        <Link
            href={href}
            className="group relative flex flex-col bg-white border border-slate-200 shadow-sm rounded-sm transition-all duration-300 hover:shadow-xl hover:ring-1 hover:ring-slate-200"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                />
            </div>
            <div className="flex items-center justify-between p-4 bg-white">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight pr-4 group-hover:text-red-600 transition-colors">
                    {label}
                </h3>
                <div className="shrink-0 text-slate-400 group-hover:text-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}

export function DahuaSolutionsGrid({ categoriesData, servicesData }: any) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const categories: any[] = categoriesData ? JSON.parse(categoriesData) : [];
    const services: any[] = servicesData ? JSON.parse(servicesData) : [];

    if (!mounted || (categories.length === 0 && services.length === 0)) return null;

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat: any) => (
                <GridCard
                    key={cat.id}
                    href={`/solutions/category/${cat.slug}`}
                    imageSrc={resolveImageUrl(cat.imageUrl) || "/placeholder.jpg"}
                    imageAlt={cat.name}
                    label={cat.name}
                />
            ))}
            {services.map((svc: any) => (
                <GridCard
                    key={svc.id}
                    href={`/solutions/${svc.slug}`}
                    imageSrc={resolveImageUrl(svc.coverImageUrl || svc.overviewImageUrl) || "/placeholder.jpg"}
                    imageAlt={svc.title}
                    label={svc.title}
                />
            ))}
        </div>
    );
}
