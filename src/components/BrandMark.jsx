// OmniRune brand mark — a stylized rune glyph inside a glowing rounded tile.
export default function BrandMark({ className = "w-8 h-8" }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-xl ${className}`}
      style={{
        background:
          "linear-gradient(150deg, hsl(282 80% 22%), hsl(276 70% 14%))",
        boxShadow:
          "inset 0 1px 0 hsl(280 80% 75% / 0.35), 0 8px 22px -8px hsl(282 85% 55% / 0.7)",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-[60%] h-[60%]">
        <defs>
          <linearGradient id="omniRuneGrad" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="hsl(300 90% 82%)" />
            <stop offset="100%" stopColor="hsl(276 90% 64%)" />
          </linearGradient>
        </defs>
        <path
          d="M12 2.5 L12 21.5 M12 8 L18 4 M12 13 L6 9.5 M12 13 L18 17.5"
          stroke="url(#omniRuneGrad)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
