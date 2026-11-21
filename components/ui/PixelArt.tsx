// Renders a pixel bitmap as crisp SVG squares.
// - `colors` maps bitmap letters to colours, or use `rowColors` to shade row by row.
// - `animateIn` makes pixels "build" in with staggered delays.
// - `interactive` lets each pixel pop on hover.

import type { Bitmap } from "./pixel-icons";

export function PixelArt({
  bitmap,
  colors = {},
  rowColors,
  className = "",
  animateIn = false,
  interactive = false,
  label,
}: {
  bitmap: Bitmap;
  colors?: Record<string, string>;
  rowColors?: string[];
  className?: string;
  animateIn?: boolean;
  interactive?: boolean;
  label?: string;
}) {
  const width = Math.max(...bitmap.map((r) => r.length));
  const height = bitmap.length;
  const pixels: { x: number; y: number; fill: string }[] = [];
  bitmap.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ".") return;
      const fill = rowColors ? rowColors[Math.min(y, rowColors.length - 1)] : (colors[ch] ?? "currentColor");
      pixels.push({ x, y, fill });
    }),
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className={`${interactive ? "pixel-interactive" : ""} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {pixels.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={1.02}
          height={1.02}
          fill={p.fill}
          className={`pixel ${animateIn ? "animate-pixel-in" : ""}`}
          // Deterministic pseudo-random stagger so server and client render the same.
          style={animateIn ? { animationDelay: `${((p.x * 7 + p.y * 13) % 17) * 45}ms` } : undefined}
        />
      ))}
    </svg>
  );
}
