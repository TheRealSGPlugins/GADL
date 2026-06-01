import { useMemo } from "react";

// Scattered dots that fade/pulse in and out at random positions and timings,
// creating a subtle twinkling starfield behind the hero.
export default function PulseDots({ count = 44 }) {
  const dots = useMemo(() => {
    const sizes = [2, 2, 3, 3, 4, 5];
    return Array.from({ length: count }).map((_, i) => {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      return {
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size,
        dur: 2.5 + Math.random() * 4, // 2.5s – 6.5s
        delay: Math.random() * 6, // staggered starts
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className="omni-dot"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            "--dur": `${d.dur}s`,
            "--delay": `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
