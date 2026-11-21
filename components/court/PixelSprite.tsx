// Draws a pixel grid (see sprites.ts) as SVG rects inside a parent <svg>.
// Neighbouring pixels of the same colour on a row are merged into one rect,
// so a whole character is only a few dozen elements.

import type { Grid } from "./sprites";

export function PixelSprite({
  grid,
  colors,
  x = 0,
  y = 0,
  className,
}: {
  grid: Grid;
  colors: Record<string, string>;
  x?: number;
  y?: number;
  className?: string;
}) {
  const runs: { x: number; y: number; w: number; fill: string }[] = [];
  grid.forEach((row, ry) => {
    let start = 0;
    for (let i = 1; i <= row.length; i++) {
      if (i === row.length || row[i] !== row[start]) {
        const ch = row[start];
        if (ch !== "." && colors[ch]) runs.push({ x: start, y: ry, w: i - start, fill: colors[ch] });
        start = i;
      }
    }
  });
  return (
    // Outer <g> positions the sprite; the inner one carries CSS animations
    // (a CSS transform would otherwise replace the translate).
    <g transform={`translate(${x} ${y})`}>
      <g className={className} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        {runs.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w + 0.02} height={1.02} fill={r.fill} />
        ))}
      </g>
    </g>
  );
}

/** Pixel rectangle helper for scene furniture. */
export function Px({ x, y, w, h, fill, opacity }: { x: number; y: number; w: number; h: number; fill: string; opacity?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />;
}
