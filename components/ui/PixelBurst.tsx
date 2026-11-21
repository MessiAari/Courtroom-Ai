"use client";
// One-shot pixel confetti for verdict moments (skipped with reduced motion).

import { motion, useReducedMotion } from "framer-motion";

/** A one-shot burst of square "pixels" from the centre. */
export function PixelBurst({ color, count = 28, delay = 0.35, palette, className = "left-1/2 top-[38%]" }: { color: string; count?: number; delay?: number; palette?: string[]; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const colors = palette ?? [color, "#c89b55", "#e8dfce"];
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, k) => {
        // deterministic spread so server and client match
        const angle = (k / count) * Math.PI * 2 + (k % 3) * 0.2;
        const dist = 90 + ((k * 37) % 70);
        return (
          <motion.span
            key={k}
            className="absolute h-2 w-2"
            style={{ background: colors[k % 3] }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist + 30, opacity: [0, 1, 1, 0], rotate: 90 }}
            transition={{ duration: 1.3, delay, ease: [0.1, 0.7, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}
