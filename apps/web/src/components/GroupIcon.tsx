const PATHS: Record<string, React.ReactNode> = {
  "ti-video": <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></>,
  "ti-id-badge-2": <><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="10" r="2.4" /><path d="M8 16c0-2 1.8-3 4-3s4 1 4 3" /></>,
  "ti-flame": <path d="M12 3c3 4 5 6 5 9.5A5 5 0 1 1 7 12.5c0-1.6.8-2.7 1.7-3.6.1 1.7 1 2.6 1.8 2.6 0-2.6-1-4.3.5-8.5z" />,
  "ti-door": <><rect x="6" y="3" width="12" height="18" rx="1" /><circle cx="14.5" cy="12" r="1" /></>,
  "ti-phone": <path d="M5 4h3.5l1.8 4.5-2.3 1.6a11 11 0 0 0 5 5l1.6-2.3L19 16v3.5a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" />,
  "ti-smart-home": <><path d="M3.5 11.5 12 5l8.5 6.5" /><path d="M5.5 10.5V20h13v-9.5" /></>,
  "ti-router": <><rect x="3" y="13" width="18" height="6" rx="1.5" /><circle cx="7" cy="16" r="0.9" /><path d="M12 13V8m0 0-3 2.5M12 8l3 2.5" /></>,
  "ti-wifi": <><path d="M4.5 11a11 11 0 0 1 15 0" /><path d="M8 14.5a6 6 0 0 1 8 0" /><circle cx="12" cy="18.5" r="1" /></>,
  "ti-plug-connected": <><path d="M9 7V4M15 7V4M8 7h8v3.5a4 4 0 0 1-8 0z" /><path d="M12 14.5V20" /></>,
  "ti-battery-3": <><rect x="3" y="8" width="16" height="8" rx="1.5" /><path d="M21 11v2" /><path d="M7 11v2M10.5 11v2" /></>,
  "ti-device-desktop": <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></>,
  "ti-tool": <path d="M14.5 5.5a3.5 3.5 0 0 0-4.6 4.4L4 15.8V20h4.2l5.9-5.9a3.5 3.5 0 0 0 4.4-4.6l-2.2 2.2-1.9-1.9z" />,
};

export function GroupIcon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name] ?? <circle cx="12" cy="12" r="7" />}
    </svg>
  );
}
