"use client";
// Small shared UI pieces: buttons, the pixel staircase, the spectrum bar,
// a pixel-dot spotlight card, and an infinite marquee.

import { useRef } from "react";
import Link from "next/link";

// Jade ramp, light → deep (used for the courthouse steps and the stepped divider).
const SPECTRUM = ["#6ee7b7", "#34d399", "#10b981", "#059669", "#047857"];

/** Primary / secondary buttons. The arrow nudges on hover; primary turns jade. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link href={href} className={`${buttonClass(variant)} ${className}`}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

export function buttonClass(variant: "primary" | "secondary" | "ghost" = "primary") {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40";
  if (variant === "primary") return `${base} bg-ink text-bg hover:bg-accent`;
  if (variant === "secondary") return `${base} border border-line-strong text-ink hover:border-ink hover:bg-white/[0.04]`;
  return `${base} text-muted hover:text-ink`;
}

export function Arrow() {
  return (
    <svg viewBox="0 0 5 5" shapeRendering="crispEdges" className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
      <path d="M0 2h4v1H0zM2 0h1v1H2zM3 1h1v1H3zM3 3h1v1H3zM2 4h1v1H2z" fill="currentColor" />
    </svg>
  );
}

/** Courthouse steps: stepped pixel blocks in the jade ramp. */
export function PixelStairs({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  // Each column: [height in steps, colour index]
  const cols = [5, 4, 4, 3, 2, 2, 1];
  return (
    <div className={`flex items-end ${flip ? "flex-row-reverse" : ""} ${className}`} aria-hidden>
      {cols.map((h, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col-reverse">
          {Array.from({ length: h }, (_, j) => (
            <div key={j} className="aspect-square w-full" style={{ background: SPECTRUM[Math.min(SPECTRUM.length - 1, j + Math.floor(i / 2))] }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Thin stepped jade stripe used as a divider. */
export function SpectrumBar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-2 ${className}`} aria-hidden>
      {SPECTRUM.map((c) => (
        <div key={c} className="flex-1" style={{ background: c }} />
      ))}
    </div>
  );
}

/**
 * Card with a pixel-dot spotlight that follows the cursor
 * (our take on 21st.dev's "pixel canvas" hover effect, written with CSS masks).
 */
export function SpotlightCard({
  children,
  className = "",
  color = "#34d399",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  return (
    <Tag
      ref={ref as never}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={`group/spot relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          backgroundImage: `radial-gradient(${color} 1px, transparent 1.4px)`,
          backgroundSize: "7px 7px",
          maskImage: "radial-gradient(170px circle at var(--x, 50%) var(--y, 50%), black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(170px circle at var(--x, 50%) var(--y, 50%), black, transparent 75%)",
        }}
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}

/** Infinite horizontal marquee. Pauses on hover; static for reduced motion. */
export function Marquee({ children, duration = 40, className = "" }: { children: React.ReactNode; duration?: number; className?: string }) {
  return (
    <div
      className={`group/mq relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] ${className}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className="flex w-max shrink-0 animate-marquee gap-3 pr-3 group-hover/mq:[animation-play-state:paused] motion-reduce:animate-none">
        {children}
        {/* duplicate for a seamless loop (hidden from screen readers) */}
        <div className="flex gap-3" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
