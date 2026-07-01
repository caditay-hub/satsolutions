"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { ServiceDto } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { ServiceItemsAccordion } from "@/components/ServiceItemsAccordion";
import { ServiceRequestModal } from "@/components/ServiceRequestModal";

interface SolutionDetailsClientProps {
  item: ServiceDto;
}

export function SolutionDetailsClient({ item }: SolutionDetailsClientProps) {
  const t = useTranslations("solutionDetail");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const img = resolveImageUrl(item.coverImageUrl) || resolveImageUrl(item.category?.imageUrl);
  const items = item.items ?? [];

  // Sticky sub-nav mapping
  const sections = [
    { id: "overview", label: t("tabOverview") },
    { id: "scenarios", label: t("tabScenarios"), show: !!item.children?.length },
    { id: "details", label: t("tabDetails"), show: !!items.length },
    { id: "tech", label: t("tabTech"), show: !!item.keyTechnologies?.length },
    { id: "topology", label: t("tabTopology"), show: !!item.overviewImageUrl },
  ].filter(s => s.show !== false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // Header + Subnav height approx
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-white font-main min-h-screen text-slate-900 overflow-x-hidden">
      {/* 1. Hero Banner (Ultra-Immersive) */}
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-[#0A0E14]">
        {img ? (
          <Image
            alt={item.title}
            src={img as string}
            fill
            className="object-cover opacity-50 scale-105 transition-transform duration-[10s] hover:scale-100"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E14] via-[#0A0E14]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="container-page">
            <div className="max-w-3xl">
              <div className="mb-8 flex items-center gap-6 animate-fade-in">
                <div className="bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all border border-white/10 rounded-full h-12 w-12 flex items-center justify-center">
                  <BackButton />
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-[#E60012] to-transparent" />
                <span className="text-[#E60012] uppercase tracking-[0.4em] text-[10px] font-black">
                  {item.category?.name || "Global Solution"}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95] text-white uppercase italic">
                {item.title}
              </h1>
              {item.excerpt ? (
                <p className="text-xl text-white/70 leading-relaxed mb-10 max-w-2xl font-medium border-l-4 border-white/20 pl-6">
                  {item.excerpt}
                </p>
              ) : null}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative inline-flex items-center gap-4 bg-[#E60012] text-white px-12 py-5 font-black transition-all hover:bg-red-700 shadow-[0_0_40px_rgba(230,0,18,0.3)] uppercase tracking-widest text-xs italic"
              >
                <span>{t("expertConsult")}</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Premium Sticky Nav */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-2xl hidden md:block transition-all">
        <div className="container-page">
          <div className="flex items-center gap-12 h-20 overflow-x-auto no-scrollbar justify-center">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`relative h-full text-[11px] font-black uppercase tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-1 ${activeSection === s.id ? "text-[#E60012]" : "text-slate-400 hover:text-slate-900"
                  }`}
              >
                <span className="z-10">{s.label}</span>
                {activeSection === s.id && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-[#E60012] animate-scale-x" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Content Content Container */}
      <main className="space-y-40 pb-40">

        {/* Overview Section */}
        <section id="overview" className="relative pt-32 scroll-mt-40 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 skew-x-[-15deg] translate-x-1/2" />
          <div className="container-page">
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
              <h2 className="text-sm font-black text-[#E60012] uppercase tracking-[0.5em] mb-6">Overview / 01</h2>
              <h3 className="text-4xl md:text-5xl font-black mb-12 text-slate-950 uppercase italic tracking-tighter">{t("overviewTitle")}</h3>
              <div className="prose prose-2xl max-w-none text-slate-500 leading-relaxed font-semibold whitespace-pre-line text-lg italic">
                {item.content || t("overviewFallback")}
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Solutions (Scenarios) - Classical Dahua Card Style */}
        {(item.children ?? []).length > 0 && (
          <section id="scenarios" className="container-page scroll-mt-40">
            <div className="mb-16">
              <h2 className="text-sm font-black text-[#E60012] uppercase tracking-[0.5em] mb-4">{t("industriesLabel")}</h2>
              <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">{t("scenariosTitle")}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {item.children?.map((child) => (
                <div
                  key={child.id}
                  className="group flex flex-col bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <Image
                      src={resolveImageUrl(child.coverImageUrl) || resolveImageUrl(item.category?.imageUrl) || "/placeholder.jpg"}
                      alt={child.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
                      {child.title}
                    </h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                      {child.excerpt || t("childFallback")}
                    </p>

                    <div className="mt-auto">
                      <a
                        href={`/solutions/${child.slug}`}
                        className="inline-flex items-center justify-center bg-[#0055b3] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#004494]"
                      >
                        {t("learnMore")}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Detailed Solutions (Grid Feature Cards) */}
        {items.length > 0 && (
          <section id="details" className="bg-[#F8F9FB] py-40 scroll-mt-40 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E60012]/30 to-transparent" />
            <div className="container-page">
              <div className="text-center mb-24">
                <h2 className="text-sm font-black text-[#E60012] uppercase tracking-[0.5em] mb-4">Technical Details / 03</h2>
                <h3 className="text-4xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter">{t("detailsTitle")}</h3>
              </div>

              <div className="grid gap-20">
                {items.map((group, idx) => (
                  <div key={idx} className="bg-white p-12 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border-t-8 border-[#E60012] rounded-sm">
                    <h4 className="text-3xl font-black text-slate-900 mb-12 uppercase italic tracking-tight flex items-center gap-6">
                      <span className="text-[#E60012] opacity-30 select-none">/0{idx + 1}</span>
                      {group.title}
                    </h4>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {group.cards?.map((card, cidx) => (
                        <div key={cidx} className="group p-8 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 rounded-sm">
                          {card.descriptions?.map((desc, didx) => (
                            <div key={didx} className="mb-6 last:mb-0">
                              <h5 className="text-slate-900 font-black text-lg mb-3 uppercase tracking-tighter bg-[#E60012] text-white px-3 py-1 inline-block italic">
                                {desc.description}
                              </h5>
                              <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-wide">
                                {desc.subDescription}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {group.description && (
                      <div className="mt-16 p-8 bg-slate-900 text-white rounded-sm font-black uppercase text-sm tracking-widest leading-loose italic opacity-90 border-l-8 border-[#E60012]">
                        {group.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Key Technologies - Premium Alternating Layout */}
        {(item.keyTechnologies ?? []).length > 0 && (
          <section id="tech" className="container-page scroll-mt-40">
            <div className="mb-32">
              <h2 className="text-sm font-black text-[#E60012] uppercase tracking-[0.5em] mb-4">Core Innovation / 04</h2>
              <h3 className="text-4xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">{t("techTitle")}</h3>
            </div>

            <div className="space-y-40">
              {item.keyTechnologies?.map((kt, idx) => (
                <div key={kt.id} className="group grid lg:grid-cols-12 gap-16 items-center">
                  <div className={`lg:col-span-5 space-y-10 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="relative">
                      <div className="absolute -top-12 -left-12 text-[120px] font-black text-[#E60012]/5 italic select-none">
                        T{idx + 1}
                      </div>
                      <h3 className="relative text-4xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter leading-[0.9] border-l-8 border-[#E60012] pl-8">
                        {kt.title}
                      </h3>
                    </div>

                    <div className="space-y-8">
                      <div className="prose prose-xl text-slate-500 font-black uppercase tracking-wider text-sm leading-loose">
                        {kt.description}
                      </div>
                      {kt.secondaryDescription && (
                        <div className="prose prose-lg text-slate-400 font-bold border-t border-slate-100 pt-8 italic leading-relaxed">
                          {kt.secondaryDescription}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`lg:col-span-7 grid gap-6 relative ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                    {kt.imageUrl && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.1)] group-hover:shadow-[0_80px_150px_rgba(230,0,18,0.15)] transition-all duration-700">
                        <Image
                          src={resolveImageUrl(kt.imageUrl)!}
                          alt={kt.title}
                          fill
                          className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
                      </div>
                    )}
                    {kt.secondaryImageUrl && (
                      <div className="absolute -bottom-16 -right-16 md:w-2/3 aspect-video z-10 overflow-hidden shadow-2xl border-8 border-white">
                        <Image
                          src={resolveImageUrl(kt.secondaryImageUrl)!}
                          alt={kt.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Global Architecture (Topology) - Full Screen Impact */}
        {item.overviewImageUrl && (
          <section id="topology" className="relative scroll-mt-40">
            <div className="bg-[#0A0E14] py-40 text-white overflow-hidden">
              <div className="absolute top-0 right-10 text-[200px] font-black text-white/5 italic select-none uppercase tracking-tighter leading-none h-full overflow-hidden">
                Topology
              </div>

              <div className="container-page relative z-10">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                  <h2 className="text-sm font-black text-[#E60012] uppercase tracking-[0.5em] mb-6">Network Structure / 05</h2>
                  <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">{t("topologyTitle")}</h3>
                  <div className="h-2 w-32 bg-[#E60012] mx-auto mb-10" />
                  <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
                    {t("topologySubtitle")}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-zinc-900 to-black p-12 md:p-24 shadow-[0_100px_200px_rgba(0,0,0,0.5)] border border-zinc-800 relative group">
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#E60012]/50" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#E60012]/50" />

                  <img
                    src={resolveImageUrl(item.overviewImageUrl)!}
                    alt={t("topologyTitle")}
                    className="w-full h-auto object-contain mx-auto max-h-[1000px] filter brightness-110 drop-shadow-[0_0_50px_rgba(230,0,18,0.2)]"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Global Request Modal */}
      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceName={item.title}
      />
    </div>
  );
}
