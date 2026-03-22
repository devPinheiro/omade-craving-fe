import { useMemo } from "react";

/** Playful, visible confetti for mobile landing (below header). */
export function MobileHeroConfetti() {
  const pieces = useMemo(() => {
    const colors = [
      "bg-pink-400",
      "bg-sky-400",
      "bg-lime-400",
      "bg-yellow-300",
      "bg-fuchsia-400",
      "bg-amber-400",
      "bg-violet-400",
      "bg-orange-400",
      "bg-emerald-400",
      "bg-rose-400",
      "bg-cyan-400",
      "bg-indigo-400",
    ];
    return Array.from({ length: 64 }, (_, i) => ({
      id: i,
      left: (i * 5.7 + (i % 5) * 1.8) % 96,
      top: 4 + (i % 6) * 4,
      w: 5 + (i % 6),
      h: 6 + (i % 7),
      /** Faster loops = feels more “often” and lively */
      duration: 1.6 + (i % 9) * 0.22,
      delay: (i * 0.08) % 2.2,
      color: colors[i % colors.length],
      rounded: i % 4 === 0 ? "rounded-full" : i % 4 === 1 ? "rounded-md" : "rounded-sm",
      /** Alternate animation for organic, playful motion */
      alt: i % 2 === 1,
    }));
  }, []);

  return (
    <div
      className="lg:hidden w-full pointer-events-none select-none  px-1"
      aria-hidden
    >
      <div className="relative mx-auto h-32 max-w-2xl overflow-hidden rounded-b-3xl">
        {/* Very light top fade so colors stay visible */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-6 bg-gradient-to-b from-white/40 to-transparent" />
        {pieces.map((p) => (
          <span
            key={p.id}
            className={`absolute shadow-md ring-1 ring-white/30 ${p.color} ${p.rounded} ${
              p.alt ? "mobile-confetti-piece-alt" : "mobile-confetti-piece"
            }`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.w,
              height: p.h,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
