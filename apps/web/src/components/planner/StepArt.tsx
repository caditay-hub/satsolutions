/**
 * Картинки к шагам «Как это работает» на странице проектировщика (11.11): план → камеры → смета.
 * Свои SVG в цветах блока на главной (решение владельца — рисовать самим, без генерации).
 */
const INK = "#334155", TEAL = "#328fa8", ZONE = "#6bb3c5", ZONE_D = "#1d6a7d", PAPER = "#f4fafb", LINE = "#addbe3";

export function StepArt({ step }: { step: 0 | 1 | 2 }) {
  return (
    <svg viewBox="0 0 160 100" className="block h-auto w-full" aria-hidden="true">
      <rect x="0" y="0" width="160" height="100" rx="10" fill={PAPER} />
      {step === 0 ? (
        <g>
          {/* лист плана со стенами и стрелка загрузки */}
          <rect x="34" y="14" width="72" height="72" rx="4" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <path d="M42 22h56v56H42z M70 22v30 M70 52h28" fill="none" stroke={INK} strokeWidth="2.5" />
          <path d="M42 70h20" stroke="#e02020" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="118" cy="66" r="16" fill={TEAL} />
          <path d="M118 74V58M111 64l7-7 7 7" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : step === 1 ? (
        <g>
          {/* план с камерой и зоной обзора */}
          <rect x="22" y="14" width="116" height="72" rx="4" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M80 14v40" stroke={INK} strokeWidth="2.5" />
          <path d="M30 22L76 34A48 48 0 0 1 58 64Z" fill={ZONE} opacity=".6" />
          <path d="M30 22L52 28A24 24 0 0 1 43 43Z" fill={ZONE_D} opacity=".75" />
          <circle cx="30" cy="22" r="6" fill={TEAL} stroke="#fff" strokeWidth="2" />
          <path d="M130 78L96 66A36 36 0 0 1 110 46Z" fill={ZONE} opacity=".6" />
          <circle cx="130" cy="78" r="6" fill={TEAL} stroke="#fff" strokeWidth="2" />
          <rect x="88" y="24" width="42" height="14" rx="7" fill="#fff" stroke={LINE} />
          <circle cx="96" cy="31" r="3" fill="#22c55e" />
          <path d="M102 31h22" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          {/* лист сметы с таблицей и итогом */}
          <rect x="40" y="10" width="64" height="80" rx="4" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          <path d="M48 22h30M48 32h48M48 40h48M48 48h48M48 56h48" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 68h20M80 68h16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <rect x="96" y="56" width="34" height="20" rx="4" fill="#e02020" />
          <text x="113" y="70" fontSize="10" fontWeight="800" fill="#fff" textAnchor="middle">PDF</text>
        </g>
      )}
    </svg>
  );
}
