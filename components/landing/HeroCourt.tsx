"use client";
// The hero's pixel-art courtroom: a layered scene with depth.
// Four SVG layers (wall → bench → counsel → gallery) share one viewBox and
// drift at different speeds with the pointer (parallax). A short loop shows
// what the app does: the Prosecution argues FOR, the Defence AGAINST, and the
// Judge rules — scores float up and the health bar shifts. Hover a character
// to hear its role (touch: tap). Static and calm with reduced motion.

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { Emotion, Speaker } from "@/lib/types";
import { PixelSprite, Px } from "@/components/court/PixelSprite";
import { CAST_COLORS, GAVEL_SPRITE, GAVEL_SPRITE_COLORS, judgeSprite, lawyerSprite } from "@/components/court/sprites";
import { useBeat } from "@/components/court/useBeat";
import { SCALES } from "@/components/ui/pixel-icons";
import { PixelMeter } from "@/components/ui/PixelMeter";
import { PARTY } from "@/lib/speakers";

const W = 112;
const H = 58;
const POS: Record<Speaker, { x: number; y: number; cx: number }> = {
  prosecutor: { x: 10, y: 16, cx: 18 },
  judge: { x: 47, y: 8, cx: 56 },
  defender: { x: 86, y: 16, cx: 94 },
};

// One loop of the demo: who talks, what they say, and the running score.
const BEATS: { who: Speaker; line: string; emotion: Emotion; score: [number, number] }[] = [
  { who: "prosecutor", line: "The evidence says yes.", emotion: "confident", score: [0, 0] },
  { who: "defender", line: "Not so fast — here's why not.", emotion: "smug", score: [0, 0] },
  { who: "judge", line: "Round to the Prosecution, 8–6.", emotion: "neutral", score: [8, 6] },
  { who: "defender", line: "That's a false dilemma.", emotion: "angry", score: [8, 6] },
  { who: "prosecutor", line: "Then answer the data.", emotion: "neutral", score: [8, 6] },
  { who: "judge", line: "Rebuttal to the Defence, 9–5.", emotion: "neutral", score: [13, 15] },
];

const ROLE: Record<Speaker, { tag: string; text: string }> = {
  prosecutor: { tag: "Argues FOR", text: "Builds the case for the motion and attacks the other side's points." },
  judge: { tag: "Decides", text: "Scores every round, objects to fallacies and names the winner." },
  defender: { tag: "Argues AGAINST", text: "Same model, same rules, opposite brief — no easy wins." },
};

/** A layer that drifts with the pointer by `depth` pixels. */
function Layer({ mx, my, depth, children }: { mx: MotionValue<number>; my: MotionValue<number>; depth: number; children: React.ReactNode }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth * 0.5);
  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full scale-[1.04]"
      style={{ x, y }}
      aria-hidden
    >
      {children}
    </motion.svg>
  );
}

export function HeroCourt() {
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(0);
  const [hover, setHover] = useState<Speaker | null>(null);

  // Advance the demo loop (paused while the visitor hovers a character).
  useEffect(() => {
    if (reduce || hover) return;
    const t = setInterval(() => setBeat((b) => (b + 1) % BEATS.length), 2600);
    return () => clearInterval(t);
  }, [reduce, hover]);

  const b = BEATS[beat];
  const speaking: Speaker = hover ?? b.who;
  const mouth = useBeat(!reduce, 170);
  const ruling = !hover && b.who === "judge";

  // Faces: keep each lawyer's last emotion.
  const faces = useMemo(() => {
    const f: Record<"prosecutor" | "defender", Emotion> = { prosecutor: "neutral", defender: "neutral" };
    for (let i = 0; i <= beat; i++) {
      const s = BEATS[i];
      if (s.who !== "judge") f[s.who] = s.emotion;
    }
    return f;
  }, [beat]);

  // Pointer parallax (springy, off for reduced motion and touch).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18 });
  const my = useSpring(py, { stiffness: 60, damping: 18 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const lawyer = (side: "prosecutor" | "defender") => {
    const on = speaking === side;
    return (
      <g opacity={on ? 1 : 0.82}>
        <PixelSprite
          grid={lawyerSprite(side, { emotion: on && hover ? "confident" : faces[side], talking: on && mouth, gesture: on && (hover === side || faces[side] !== "neutral") })}
          colors={CAST_COLORS[side]}
          x={POS[side].x}
          y={POS[side].y}
          className={reduce ? "" : on ? "animate-talk" : "animate-idle"}
        />
      </g>
    );
  };

  const line = hover ? ROLE[hover].text : b.line;

  return (
    <div
      className="relative"
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        setHover(null);
      }}
    >
      {/* Ambient glow under the scene */}
      <div className="pointer-events-none absolute -inset-x-10 -bottom-16 top-1/3 -z-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(200,155,85,0.22),transparent)] blur-2xl" aria-hidden />

      <div
        className="relative overflow-clip rounded-2xl border border-line-strong bg-[#0c0c0f] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]"
        style={{ aspectRatio: `${W} / ${H}` }}
        role="img"
        aria-label="A pixel-art courtroom: the Prosecution (blue) argues for, the Defence (red) argues against, and the Judge (gold) scores each round and decides."
      >
        {/* 1 · Back wall, windows, light */}
        <Layer mx={mx} my={my} depth={-5}>
          <defs>
            <linearGradient id="hc-win" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a3560" />
              <stop offset="1" stopColor="#151a2b" />
            </linearGradient>
            <linearGradient id="hc-shaft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9d6ff" stopOpacity="0.16" />
              <stop offset="1" stopColor="#c9d6ff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="hc-lamp">
              <stop offset="0" stopColor="#e6c88f" stopOpacity="0.5" />
              <stop offset="1" stopColor="#e6c88f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <Px x={-4} y={-4} w={W + 8} h={44} fill="#16151b" />
          {Array.from({ length: 9 }, (_, i) => (
            <Px key={i} x={i * 14 - 1} y={-4} w={1} h={30} fill="#1c1b21" />
          ))}
          <Px x={-4} y={26} w={W + 8} h={14} fill="#1b191e" />
          <Px x={-4} y={26} w={W + 8} h={1} fill="#6b4c24" />
          {Array.from({ length: 15 }, (_, i) => (
            <Px key={i} x={i * 8 + 1} y={29} w={2} h={9} fill="#201e24" />
          ))}
          {/* pillars */}
          {[2, 104].map((x) => (
            <g key={x}>
              <Px x={x} y={-4} w={6} h={42} fill="#211f26" />
              <Px x={x - 1} y={2} w={8} h={2} fill="#6b4c24" />
              <Px x={x + 1} y={4} w={1} h={33} fill="#2a2830" />
            </g>
          ))}
          {/* tall window with stars and a moonlit shaft */}
          <Px x={43} y={1} w={26} h={20} fill="#6b4c24" />
          <rect x={44} y={2} width={24} height={18} fill="url(#hc-win)" />
          <Px x={55} y={2} w={2} h={18} fill="#6b4c24" />
          <Px x={44} y={10} w={24} h={1} fill="#6b4c24" />
          {[
            [47, 4],
            [52, 7],
            [60, 4],
            [65, 8],
            [49, 15],
            [63, 14],
          ].map(([sx, sy], i) => (
            <rect key={i} x={sx} y={sy} width={1} height={1} fill="#e8dfce" className={reduce ? "" : "animate-flicker"} style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
          <polygon points="44,20 68,20 86,58 26,58" fill="url(#hc-shaft)" />
          {/* party banners */}
          <WallBanner x={18} color="#628bff" dark="#3f5fc4" />
          <WallBanner x={88} color="#e16b64" dark="#a9463f" />
          {/* lamps */}
          {[33, 79].map((lx) => (
            <g key={lx}>
              <Px x={lx} y={-4} w={1} h={8} fill="#3e3c44" />
              <Px x={lx - 2} y={4} w={5} h={2} fill="#c89b55" />
              <Px x={lx - 1} y={6} w={3} h={1} fill="#f4e2b8" />
              <circle cx={lx + 0.5} cy={8} r={12} fill="url(#hc-lamp)" className={reduce ? "" : "animate-flicker"} />
            </g>
          ))}
        </Layer>

        {/* 2 · Floor + bench + Judge */}
        <Layer mx={mx} my={my} depth={-2}>
          <Px x={-4} y={38} w={W + 8} h={24} fill="#121116" />
          {/* floor rows get taller toward the viewer, for depth */}
          {[
            [38, 3],
            [41, 4],
            [45, 5],
            [50, 6],
            [56, 7],
          ].map(([y, h], row) =>
            Array.from({ length: 15 }, (_, col) =>
              (row + col) % 2 ? <Px key={`${row}-${col}`} x={col * 8 - 4} y={y} w={8} h={h} fill="#17161c" /> : null,
            ),
          )}
          {/* spotlight on the Judge while ruling */}
          <polygon points={`${POS.judge.cx - 3},-4 ${POS.judge.cx + 3},-4 ${POS.judge.cx + 16},40 ${POS.judge.cx - 16},40`} fill="#c89b55" opacity={speaking === "judge" ? 0.12 : 0} style={{ transition: "opacity .4s" }} />
          <PixelSprite grid={judgeSprite(ruling || hover === "judge" ? "stern" : "thinking", speaking === "judge" && mouth)} colors={CAST_COLORS.judge} x={POS.judge.x} y={POS.judge.y} className={reduce ? "" : "animate-idle"} />
          <motion.g
            style={{ transformBox: "fill-box", originX: 0.95, originY: 0.5 }}
            animate={ruling && !reduce ? { rotate: [0, -45, 10, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PixelSprite grid={GAVEL_SPRITE} colors={GAVEL_SPRITE_COLORS} x={65} y={18} />
          </motion.g>
          <Px x={34} y={22} w={44} h={18} fill="#2a2019" />
          <Px x={34} y={22} w={44} h={1} fill="#4a3626" />
          <Px x={34} y={23} w={44} h={1} fill="#c89b55" />
          <Px x={36} y={26} w={40} h={12} fill="#241b15" />
          <PixelSprite grid={SCALES} colors={{ a: "#c89b55", b: "#e6c88f" }} x={50} y={28} />
        </Layer>

        {/* 3 · Counsel + desks */}
        <Layer mx={mx} my={my} depth={2}>
          {(["prosecutor", "defender"] as const).map((s) => (
            <polygon
              key={s}
              points={`${POS[s].cx - 3},-4 ${POS[s].cx + 3},-4 ${POS[s].cx + 15},44 ${POS[s].cx - 15},44`}
              fill={s === "prosecutor" ? "#628bff" : "#e16b64"}
              opacity={speaking === s ? 0.16 : 0.03}
              style={{ transition: "opacity .4s" }}
            />
          ))}
          {lawyer("prosecutor")}
          {lawyer("defender")}
          <CounselDesk x={2} color="#628bff" />
          <CounselDesk x={80} color="#e16b64" />
        </Layer>

        {/* 4 · Gallery silhouettes + drifting dust (closest to the viewer) */}
        <Layer mx={mx} my={my} depth={6}>
          {[-2, 7, 16, 25, 34, 72, 81, 90, 99, 108].map((gx, i) => (
            <g key={gx}>
              <Px x={gx + 1} y={50 + (i % 2)} w={4} h={4} fill="#09090c" />
              <Px x={gx} y={54 + (i % 2)} w={6} h={6} fill="#09090c" />
            </g>
          ))}
          {!reduce &&
            DUST.map(([dx, dy, d], i) => (
              <motion.rect
                key={i}
                x={dx}
                width={0.6}
                height={0.6}
                fill="#e6c88f"
                initial={{ y: dy, opacity: 0 }}
                animate={{ y: [dy, dy - 10], opacity: [0, 0.7, 0] }}
                transition={{ duration: 6 + d, repeat: Infinity, delay: d, ease: "linear" }}
              />
            ))}
        </Layer>

        {/* HTML overlays: speech, floating scores and hit areas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${speaking}-${hover ? "h" : beat}`}
            className="pointer-events-none absolute z-10"
            // the Judge's bubble hangs from the top edge; the lawyers' sit just above their heads
            style={speaking === "judge" ? { left: `${(POS.judge.cx / W) * 100}%`, top: "1%" } : { left: `${(POS[speaking].cx / W) * 100}%`, bottom: "74%" }}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            {/* Lawyers' bubbles lean toward the middle of the room so they never fall off the edge. */}
            <div
              className="relative w-max max-w-[11.5rem] rounded-md border-2 bg-ink px-2 py-1 text-center font-mono text-[9px] font-semibold leading-tight text-bg shadow-lg sm:max-w-[15rem] sm:px-3 sm:py-1.5 sm:text-xs"
              style={{ borderColor: PARTY[speaking].color, translate: `-${ANCHOR[speaking]}% 0` }}
            >
              {line}
              <span
                className="absolute -bottom-[6px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-ink"
                style={{ borderColor: PARTY[speaking].color, left: `${ANCHOR[speaking]}%` }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {ruling && !reduce && (
            <motion.div key={beat} className="pointer-events-none absolute inset-0 z-10 font-pixel" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {(["prosecutor", "defender"] as const).map((s, k) => {
                const v = b.score[k] - (beat >= 3 ? BEATS[2].score[k] : 0);
                return (
                  <motion.span
                    key={s}
                    className="absolute -translate-x-1/2 text-sm sm:text-2xl"
                    style={{ left: `${(POS[s].cx / W) * 100}%`, color: s === "prosecutor" ? "#8fadff" : "#f09a94", textShadow: "0 2px 0 #101114" }}
                    initial={{ top: "30%", opacity: 0 }}
                    animate={{ top: ["30%", "14%", "10%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.2, delay: 0.5 }}
                  >
                    +{v}
                  </motion.span>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover / tap targets over each character */}
        {(["prosecutor", "judge", "defender"] as const).map((s) => (
          <button
            key={s}
            type="button"
            className="absolute z-20 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
            style={{
              left: `${((POS[s].cx - 11) / W) * 100}%`,
              width: `${(22 / W) * 100}%`,
              top: `${((POS[s].y - 1) / H) * 100}%`,
              height: `${(24 / H) * 100}%`,
            }}
            onPointerEnter={() => setHover(s)}
            onFocus={() => setHover(s)}
            onClick={() => setHover((h) => (h === s ? null : s))}
            onBlur={() => setHover(null)}
            aria-label={`${PARTY[s].name}: ${ROLE[s].tag}. ${ROLE[s].text}`}
          />
        ))}

        {/* Desk / bench tags */}
        {(["prosecutor", "judge", "defender"] as const).map((s) => (
          <span
            key={s}
            className={`pointer-events-none absolute z-10 -translate-x-1/2 rounded-sm px-1.5 py-0.5 font-pixel text-[8px] uppercase tracking-wider transition-opacity duration-300 sm:text-[11px] ${speaking === s ? "opacity-100" : "opacity-70"}`}
            style={{
              left: `${(POS[s].cx / W) * 100}%`,
              top: s === "judge" ? "71%" : "80%",
              background: "#101114cc",
              color: PARTY[s].color,
            }}
          >
            {ROLE[s].tag}
          </span>
        ))}
      </div>

      {/* Scoreboard: the debate in one line */}
      <div className="mt-4 flex items-center gap-3 sm:gap-5">
        <span className={`hidden shrink-0 font-pixel text-xs uppercase sm:block ${speaking === "prosecutor" ? "text-pros" : "text-faint"}`}>Prosecution</span>
        <PixelMeter prosecution={b.score[0]} defence={b.score[1]} className="min-w-0 flex-1" />
        <span className={`hidden shrink-0 font-pixel text-xs uppercase sm:block ${speaking === "defender" ? "text-def" : "text-faint"}`}>Defence</span>
      </div>
    </div>
  );
}

// Where the speech bubble's tail sits (% of its width), per speaker.
const ANCHOR: Record<Speaker, number> = { prosecutor: 18, judge: 50, defender: 82 };

// Dust motes: [x, y, delay]. Fixed so server and client render the same.
const DUST: [number, number, number][] = [
  [30, 40, 0],
  [41, 46, 1.4],
  [52, 36, 2.6],
  [60, 44, 0.8],
  [71, 39, 3.1],
  [79, 47, 1.9],
  [48, 50, 4.2],
  [64, 52, 2.2],
];

function WallBanner({ x, color, dark }: { x: number; color: string; dark: string }) {
  return (
    <g>
      <Px x={x - 1} y={3} w={8} h={1} fill="#6b4c24" />
      <Px x={x} y={4} w={6} h={12} fill={color} opacity={0.82} />
      <Px x={x} y={16} w={2} h={2} fill={color} opacity={0.82} />
      <Px x={x + 4} y={16} w={2} h={2} fill={color} opacity={0.82} />
      <Px x={x + 2} y={7} w={2} h={6} fill={dark} />
    </g>
  );
}

function CounselDesk({ x, color }: { x: number; color: string }) {
  return (
    <g>
      <Px x={x} y={35} w={30} h={10} fill="#2a2019" />
      <Px x={x} y={35} w={30} h={1} fill="#4a3626" />
      <Px x={x + 2} y={37} w={26} h={6} fill="#241b15" />
      <Px x={x + 9} y={39} w={12} h={2} fill={color} />
      <Px x={x + 3} y={34} w={6} h={1} fill="#e8dfce" opacity={0.85} />
      <Px x={x + 22} y={33} w={2} h={2} fill="#c89b55" />
    </g>
  );
}
