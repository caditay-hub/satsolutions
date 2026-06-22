"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

/**
 * SAT Solutions pill-style logo.
 * Dark glassy pill with animated dot that toggles blue → red.
 * Optional subtitle "Системы безопасности" below.
 *
 * Variants:
 *  - "default" (light bg around): white pill on transparent
 *  - "dark":  for use over dark hero / dark surfaces
 */
export function SatLogo({
  variant = "default",
  showSubtitle = true,
  size = "md",
  href = "/",
  className = "",
}: {
  variant?: "default" | "dark";
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
}) {
  const tc = useTranslations("common");
  const sizes = {
    sm: { pill: "px-3 py-1.5 text-[10px]", dot: "h-1.5 w-1.5", gap: "gap-2", track: "tracking-[0.2em]", sub: "text-[9px] tracking-[0.16em] mt-1" },
    md: { pill: "px-4 py-2 text-[11px]", dot: "h-2 w-2", gap: "gap-2.5", track: "tracking-[0.22em]", sub: "text-[10px] tracking-[0.18em] mt-1" },
    lg: { pill: "px-5 py-2.5 text-sm", dot: "h-2.5 w-2.5", gap: "gap-3", track: "tracking-[0.22em]", sub: "text-[11px] tracking-[0.18em] mt-1.5" },
  }[size];

  const pillBg = variant === "dark"
    ? "bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur-md"
    : "bg-slate-800 ring-1 ring-inset ring-white/10";

  const subColor = variant === "dark" ? "text-white/70" : "text-slate-500";

  const inner = (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <span
        className={`inline-flex items-center ${sizes.gap} rounded-full ${pillBg} ${sizes.pill} shadow-sm`}
      >
        <span className={`block rounded-full ${sizes.dot} sat-logo-dot`} aria-hidden />
        <span className={`font-black uppercase text-white ${sizes.track}`}>SAT Solutions</span>
      </span>
      {showSubtitle ? (
        <span className={`pl-4 font-bold uppercase ${sizes.sub} ${subColor}`}>
          {tc("securitySystems")}
        </span>
      ) : null}
    </div>
  );

  if (!href) return inner;
  return <Link href={href} className="inline-flex shrink-0">{inner}</Link>;
}
