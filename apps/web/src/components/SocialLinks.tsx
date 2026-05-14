import type { ReactNode } from "react";

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-brand-700 hover:bg-slate-50 hover:text-brand-800 transition-colors shadow-sm"
    >
      {children}
    </a>
  );
}

export function SocialLinks({
  instagramUrl,
  telegramUrl,
  facebookUrl
}: {
  instagramUrl?: string | null;
  telegramUrl?: string | null;
  facebookUrl?: string | null;
}) {
  const ig = instagramUrl?.trim();
  const tg = telegramUrl?.trim();
  const fb = facebookUrl?.trim();
  if (!ig && !tg && !fb) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ig ? (
        <IconLink href={ig} label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </IconLink>
      ) : null}
      {tg ? (
        <IconLink href={tg} label="Telegram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 3 3.8 10.2c-1 .4-.9 1.9.2 2.2l4.8 1.4 1.8 5.4c.3.9 1.5 1.1 2.1.4l2.6-3.1 4.9 3.6c.8.6 2 .1 2.2-.9L23 4.9C23.2 3.5 22 2.6 21 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M9 13.8 20.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </IconLink>
      ) : null}
      {fb ? (
        <IconLink href={fb} label="Facebook">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v3H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1Z"
              fill="currentColor"
            />
          </svg>
        </IconLink>
      ) : null}
    </div>
  );
}

