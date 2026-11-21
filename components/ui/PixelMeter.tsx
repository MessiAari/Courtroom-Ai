// Credibility meter drawn as a retro fighting-game health bar.
// Both sides start at full health. Whenever the Judge scores one side ahead,
// the trailing side loses blocks — the bigger the gap, the more it loses.
// Red = Prosecution (left), blue = Defence (right), "VS" in the middle.

import { PixelArt } from "./PixelArt";
import { HEART } from "./pixel-icons";

const BLOCKS = 12;

/** How many health blocks each side keeps, from the running score totals. */
export function healthFor(prosecution: number, defence: number) {
  // 0.5 = even; each point of difference shifts the balance by 4%.
  const share = Math.max(0.08, Math.min(0.92, 0.5 + (prosecution - defence) * 0.04));
  return {
    pros: Math.round(BLOCKS * Math.min(1, share * 2)),
    def: Math.round(BLOCKS * Math.min(1, (1 - share) * 2)),
  };
}

function Bar({ filled, color, side }: { filled: number; color: string; side: "left" | "right" }) {
  const low = filled <= 3;
  return (
    <div className="flex min-w-0 flex-1 gap-[2px] border border-line-strong bg-bg p-[3px]">
      {Array.from({ length: BLOCKS }, (_, i) => {
        // Left bar keeps blocks at its outer (left) edge; right bar at its outer (right) edge.
        const on = side === "left" ? i < filled : i >= BLOCKS - filled;
        return (
          <div
            key={i}
            className={`h-3 flex-1 transition-colors duration-500 sm:h-3.5 ${on && low ? "animate-pulse" : ""}`}
            style={{
              background: on ? color : "#1e1e22",
              // a light top edge on lit blocks gives the classic arcade bevel
              boxShadow: on ? "inset 0 2px 0 rgba(255,255,255,0.28)" : "none",
              transitionDelay: `${(side === "left" ? BLOCKS - i : i) * 25}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

export function PixelMeter({ prosecution, defence, className = "" }: { prosecution: number; defence: number; className?: string }) {
  const hp = healthFor(prosecution, defence);
  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 ${className}`}
      role="img"
      aria-label={`Credibility health bar: Prosecution ${prosecution} points, Defence ${defence} points`}
    >
      <PixelArt bitmap={HEART} colors={{ a: "#e5484d", b: "#ffb3b5" }} className="hidden h-3.5 w-4 shrink-0 sm:block" />
      <span className="w-6 text-right font-pixel text-sm tabular-nums text-pros">{prosecution}</span>
      <Bar filled={hp.pros} color="#e5484d" side="left" />
      <span className="shrink-0 font-pixel text-xs text-accent sm:text-sm">VS</span>
      <Bar filled={hp.def} color="#3e8bff" side="right" />
      <span className="w-6 font-pixel text-sm tabular-nums text-def">{defence}</span>
      <PixelArt bitmap={HEART} colors={{ a: "#3e8bff", b: "#b5d0ff" }} className="hidden h-3.5 w-4 shrink-0 sm:block" />
    </div>
  );
}
