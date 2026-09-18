// Рисованные макеты экранов для страниц приложений (/apps/uy, /apps/davomat).
// Только фигуры и цифры — без слов, чтобы одинаково читались на всех пяти локалях.
// SAT Uy показываем телефоном, SAT Davomat — окном кабинета: так видно, где мобильное, где рабочее место.

const TEAL = "#2a7b90";
const TEAL_SOFT = "#d6edf1";
const INK = "#1e293b";
const SCREEN = "#f8fafc";
const LINE = "#e2e8f0";
const OK = "#16a34a";
const WARN = "#e0a020";

export type UyScreen = "doors" | "guest" | "tickets" | "bill";
export type DavomatScreen = "now" | "timesheet" | "late" | "export";
export type ScreenKind = UyScreen | DavomatScreen;

export const UY_SCREENS: UyScreen[] = ["doors", "guest", "tickets", "bill"];
export const DAVOMAT_SCREENS: DavomatScreen[] = ["now", "timesheet", "late", "export"];

/** Содержимое экрана рисуется в координатах 0 0 120 210 — одинаково для телефона и окна. */
function ScreenArt({ kind }: { kind: ScreenKind }) {
  switch (kind) {
    case "doors":
      return (
        <g>
          <rect x="0" y="0" width="120" height="30" fill={TEAL} />
          <rect x="10" y="11" width="34" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
          <rect x="88" y="10" width="22" height="9" rx="4.5" fill="#ffffff" opacity="0.35" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${42 + i * 38})`}>
              <rect x="8" y="0" width="104" height="30" rx="8" fill={i === 0 ? TEAL_SOFT : "#ffffff"} stroke={LINE} />
              <rect x="16" y="7" width="13" height="16" rx="2" fill={i === 0 ? TEAL : "#cbd5e1"} />
              <circle cx="26" cy="15" r="1.4" fill="#ffffff" />
              <rect x="36" y="9" width="42" height="5" rx="2.5" fill={i === 0 ? TEAL : "#cbd5e1"} />
              <rect x="36" y="18" width="26" height="4" rx="2" fill="#cbd5e1" opacity="0.8" />
              <circle cx="100" cy="15" r="4" fill={OK} />
            </g>
          ))}
          <rect x="8" y="158" width="104" height="14" rx="7" fill={TEAL} />
        </g>
      );
    case "guest": {
      const rows = ["111011101", "100010001", "101110101", "000101000", "110101011", "001010100", "101110101", "100010001", "111011101"];
      const step = 8;
      return (
        <g>
          <rect x="0" y="0" width="120" height="26" fill={TEAL} />
          <rect x="10" y="9" width="46" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
          <rect x="24" y="38" width="72" height="72" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2" />
          {rows.map((row, r) =>
            row.split("").map((ch, c) =>
              ch === "1" ? <rect key={`${r}-${c}`} x={24 + c * step} y={38 + r * step} width={step} height={step} fill={INK} /> : null,
            ),
          )}
          <rect x="24" y="120" width="72" height="5" rx="2.5" fill="#cbd5e1" />
          <rect x="24" y="132" width="44" height="5" rx="2.5" fill="#cbd5e1" opacity="0.7" />
          <rect x="24" y="152" width="72" height="14" rx="7" fill={TEAL} />
          <text x="60" y="185" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEAL}>02:00</text>
        </g>
      );
    }
    case "tickets":
      return (
        <g>
          <rect x="0" y="0" width="120" height="26" fill={TEAL} />
          <rect x="10" y="9" width="40" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
          {[
            { chip: TEAL, w: 30 },
            { chip: WARN, w: 38 },
            { chip: OK, w: 26 },
            { chip: "#cbd5e1", w: 34 },
          ].map((row, i) => (
            <g key={i} transform={`translate(0 ${36 + i * 40})`}>
              <rect x="8" y="0" width="104" height="32" rx="8" fill="#ffffff" stroke={LINE} />
              <rect x="16" y="8" width="56" height="5" rx="2.5" fill="#94a3b8" />
              <rect x="16" y="19" width="34" height="4" rx="2" fill="#cbd5e1" />
              <rect x={104 - row.w} y="8" width={row.w} height="12" rx="6" fill={row.chip} opacity="0.85" />
            </g>
          ))}
        </g>
      );
    case "bill": {
      // Кольцо из трёх долей: содержание, охрана, вывоз мусора.
      const r = 26;
      const c = 2 * Math.PI * r;
      const parts = [
        { color: TEAL, share: 0.54 },
        { color: "#5cb8c7", share: 0.31 },
        { color: "#addbe3", share: 0.15 },
      ];
      let offset = 0;
      return (
        <g>
          <rect x="0" y="0" width="120" height="26" fill={TEAL} />
          <rect x="10" y="9" width="30" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
          <text x="60" y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill={INK}>161 752</text>
          <g transform="translate(60 100) rotate(-90)">
            {parts.map((p, i) => {
              const dash = `${c * p.share - 2} ${c - c * p.share + 2}`;
              const el = (
                <circle key={i} r={r} fill="none" stroke={p.color} strokeWidth="12" strokeDasharray={dash} strokeDashoffset={-offset} />
              );
              offset += c * p.share;
              return el;
            })}
          </g>
          {[26, 34, 20, 40, 30].map((h, i) => (
            <rect key={i} x={20 + i * 17} y={186 - h} width="11" height={h} rx="3" fill={i === 4 ? TEAL : TEAL_SOFT} />
          ))}
        </g>
      );
    }
    case "now":
      return (
        <g>
          <rect x="0" y="0" width="120" height="24" fill={INK} />
          <rect x="10" y="8" width="38" height="7" rx="3.5" fill="#ffffff" opacity="0.85" />
          <circle cx="60" cy="74" r="30" fill="none" stroke={LINE} strokeWidth="12" />
          <circle
            cx="60"
            cy="74"
            r="30"
            fill="none"
            stroke={TEAL}
            strokeWidth="12"
            strokeDasharray={`${2 * Math.PI * 30 * 0.75} ${2 * Math.PI * 30 * 0.25}`}
            transform="rotate(-90 60 74)"
          />
          <text x="60" y="79" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>18/24</text>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0 ${122 + i * 26})`}>
              <circle cx="20" cy="10" r="7" fill={i === 2 ? "#cbd5e1" : TEAL_SOFT} />
              <rect x="34" y="5" width="46" height="5" rx="2.5" fill="#94a3b8" />
              <rect x="34" y="14" width="28" height="4" rx="2" fill="#cbd5e1" />
              <circle cx="100" cy="10" r="4" fill={i === 2 ? "#cbd5e1" : OK} />
            </g>
          ))}
        </g>
      );
    case "timesheet":
      return (
        <g>
          <rect x="0" y="0" width="120" height="24" fill={INK} />
          <rect x="10" y="8" width="44" height="7" rx="3.5" fill="#ffffff" opacity="0.85" />
          {[176, 168, 181, 160].map((hours, i) => (
            <g key={i} transform={`translate(0 ${38 + i * 34})`}>
              <rect x="10" y="4" width="40" height="5" rx="2.5" fill="#94a3b8" />
              <rect x="10" y="15" width="70" height="8" rx="4" fill={LINE} />
              <rect x="10" y="15" width={(hours / 190) * 70} height="8" rx="4" fill={TEAL} />
              <text x="110" y="22" textAnchor="end" fontSize="9" fontWeight="700" fill={INK}>{hours}</text>
            </g>
          ))}
          <rect x="10" y="182" width="100" height="1" fill={LINE} />
          <text x="110" y="198" textAnchor="end" fontSize="10" fontWeight="700" fill={TEAL}>685</text>
        </g>
      );
    case "late":
      return (
        <g>
          <rect x="0" y="0" width="120" height="24" fill={INK} />
          <rect x="10" y="8" width="34" height="7" rx="3.5" fill="#ffffff" opacity="0.85" />
          {[18, 34, 12, 46, 22, 30].map((h, i) => (
            <rect key={i} x={12 + i * 17} y={120 - h} width="11" height={h} rx="3" fill={i === 3 ? WARN : TEAL_SOFT} />
          ))}
          <rect x="12" y="122" width="96" height="1" fill={LINE} />
          <circle cx="36" cy="160" r="16" fill="none" stroke={TEAL} strokeWidth="3" />
          <path d="M36 150 V160 L43 164" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" />
          <rect x="62" y="150" width="46" height="6" rx="3" fill="#94a3b8" />
          <rect x="62" y="162" width="30" height="5" rx="2.5" fill="#cbd5e1" />
        </g>
      );
    case "export":
      return (
        <g>
          <rect x="0" y="0" width="120" height="24" fill={INK} />
          <rect x="10" y="8" width="40" height="7" rx="3.5" fill="#ffffff" opacity="0.85" />
          <rect x="18" y="38" width="60" height="78" rx="6" fill="#ffffff" stroke={LINE} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="26" y={50 + i * 13} width={i % 2 ? 30 : 44} height="5" rx="2.5" fill="#cbd5e1" />
          ))}
          <path d="M60 126 V150" stroke={TEAL} strokeWidth="4" strokeLinecap="round" />
          <path d="M52 143 L60 152 L68 143" fill="none" stroke={TEAL} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="30" y="158" width="60" height="30" rx="8" fill={TEAL_SOFT} stroke={TEAL} />
          <text x="60" y="178" textAnchor="middle" fontSize="14" fontWeight="700" fill={TEAL}>1C</text>
        </g>
      );
  }
}

/** Телефон с экраном: корпус, вырез камеры, содержимое. */
export function PhoneMock({ kind, uid = "g", className = "" }: { kind: ScreenKind; uid?: string; className?: string }) {
  return (
    <svg viewBox="0 0 150 250" className={className} role="presentation" aria-hidden="true">
      <rect x="9" y="4" width="132" height="242" rx="20" fill={INK} />
      <rect x="15" y="14" width="120" height="222" rx="12" fill={SCREEN} />
      <rect x="60" y="8" width="30" height="4" rx="2" fill="#475569" />
      <g transform="translate(15 14)">
        <clipPath id={`ph-${uid}-${kind}`}>
          <rect x="0" y="0" width="120" height="222" rx="12" />
        </clipPath>
        <g clipPath={`url(#ph-${uid}-${kind})`}>
          <ScreenArt kind={kind} />
        </g>
      </g>
    </svg>
  );
}

/** Окно кабинета: шапка браузера и тот же экран внутри. */
export function PanelMock({ kind, uid = "g", className = "" }: { kind: ScreenKind; uid?: string; className?: string }) {
  return (
    <svg viewBox="0 0 170 210" className={className} role="presentation" aria-hidden="true">
      <rect x="4" y="6" width="162" height="196" rx="12" fill={INK} />
      <circle cx="18" cy="18" r="3" fill="#64748b" />
      <circle cx="28" cy="18" r="3" fill="#64748b" />
      <circle cx="38" cy="18" r="3" fill="#64748b" />
      <rect x="50" y="14" width="100" height="8" rx="4" fill="#334155" />
      <rect x="10" y="30" width="150" height="164" rx="6" fill={SCREEN} />
      <g transform="translate(25 30)">
        <clipPath id={`pn-${uid}-${kind}`}>
          <rect x="0" y="0" width="120" height="164" rx="6" />
        </clipPath>
        <g clipPath={`url(#pn-${uid}-${kind})`}>
          <ScreenArt kind={kind} />
        </g>
      </g>
    </svg>
  );
}

/** Крупная связка для первого экрана: две сцены рядом — что видит человек и что видит служба. */
export function AppHeroArt({ app }: { app: "uy" | "davomat" }) {
  if (app === "uy") {
    return (
      <div className="relative flex items-end justify-center gap-0">
        <PhoneMock kind="doors" uid="hero" className="w-40 sm:w-44 drop-shadow-xl" />
        <PhoneMock kind="bill" uid="hero" className="-ml-10 mb-6 w-36 sm:w-40 drop-shadow-xl" />
      </div>
    );
  }
  return (
    <div className="relative flex items-end justify-center">
      <PanelMock kind="timesheet" uid="hero" className="w-64 sm:w-72 drop-shadow-xl" />
      <PhoneMock kind="now" uid="hero" className="-ml-14 mb-2 w-28 sm:w-32 drop-shadow-xl" />
    </div>
  );
}
