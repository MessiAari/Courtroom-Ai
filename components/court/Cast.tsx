"use client";
// Small standalone pixel portraits of the cast (used on cards and in the hero).

import type { Emotion, Speaker } from "@/lib/types";
import { PixelSprite } from "./PixelSprite";
import { CAST_COLORS, judgeSprite, lawyerSprite } from "./sprites";

/** One character in its own little SVG. The Judge stands behind a lectern. */
export function CastMember({
  who,
  emotion = "neutral",
  talking = false,
  gesture = false,
  animate = "idle",
  className = "",
}: {
  who: Speaker;
  emotion?: Emotion;
  talking?: boolean;
  gesture?: boolean;
  animate?: "idle" | "talk" | "none";
  className?: string;
}) {
  const anim = animate === "talk" ? "animate-talk" : animate === "idle" ? "animate-idle" : "";
  if (who === "judge") {
    return (
      <svg viewBox="0 0 22 24" shapeRendering="crispEdges" className={className} aria-hidden>
        <PixelSprite grid={judgeSprite(emotion === "confident" ? "pleased" : "neutral", talking)} colors={CAST_COLORS.judge} x={2} y={0} className={anim} />
        {/* lectern */}
        <rect x={0} y={13} width={22} height={11} fill="#2a2019" />
        <rect x={0} y={13} width={22} height={1} fill="#4a3626" />
        <rect x={0} y={14} width={22} height={1} fill="#c89b55" />
        <rect x={9} y={17} width={4} height={4} fill="#c89b55" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 24" shapeRendering="crispEdges" className={className} aria-hidden>
      <PixelSprite grid={lawyerSprite(who, { emotion, talking, gesture })} colors={CAST_COLORS[who]} y={1} className={anim} />
    </svg>
  );
}
