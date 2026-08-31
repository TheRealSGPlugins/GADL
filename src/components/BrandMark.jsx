export default function BrandMark({ className = "w-8 h-8" }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-xl ${className}`}
      style={{
        background:
          "linear-gradient(150deg, hsl(215 38% 16%), hsl(220 38% 8%))",
        border: "1px solid hsl(202 100% 70% / 0.35)",
        boxShadow:
          "inset 0 1px 0 hsl(210 40% 100% / 0.18), 0 8px 24px -8px hsl(202 100% 55% / 0.9)",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-[60%] h-[60%]">
        <defs>
          <linearGradient id="omniRuneGrad" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="hsl(210 40% 100%)" />
            <stop offset="45%" stopColor="hsl(198 100% 84%)" />
            <stop offset="100%" stopColor="hsl(202 100% 58%)" />
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
