import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/api";
import { SolutionDetailsClient } from "@/components/SolutionDetailsClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { item } = await getServiceBySlug(slug);
    return {
      title: item.title,
      description: item.excerpt ?? item.title,
      alternates: { canonical: `/solutions/${item.slug}` }
    };
  } catch {
    return { title: "Решение" };
  }
}

export default async function SolutionDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { item } = await getServiceBySlug(slug);
    return <SolutionDetailsClient item={item} />;
  } catch {
    notFound();
  }
}
