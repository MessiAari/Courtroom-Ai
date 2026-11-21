"use client";
// The pixel-art courtroom: a miniature game scene driven by the debate state.
// - The current speaker steps into a coloured spotlight, bounces and talks
//   (mouth frames); the others idle and dim slightly.
// - Faces follow each lawyer's `emotion` from the AI's JSON.
// - Rulings float "+score" over each lawyer; an objection makes the Judge
//   slam the gavel, the offender flinch and the gallery jump.
// - Round changes sweep a pixel banner across the room.
// The same scene is used live in the hearing and, scripted, on the landing page.

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Emotion, Side, Speaker } from "@/lib/types";
import { PixelSprite, Px } from "./PixelSprite";
import { CAST_COLORS, GAVEL_SPRITE, GAVEL_SPRITE_COLORS, judgeSprite, lawyerSprite, type JudgeMood } from "./sprites";
import { SCALES } from "@/components/ui/pixel-icons";
import { useBeat } from "./useBeat";

export interface SceneState {
  speaking: Speaker | null;
  preparing?: Speaker | null;
  emotions: Record<Side, Emotion>;
  /** Shown as a sweeping banner whenever it changes, e.g. "Round 02 · Rebuttal". */
  banner?: string | null;
  /** The side the Judge just objected to (fallacy), if any. */
  objection?: Side | null;
  /** Latest ruling: floats "+n" over each lawyer. `key` must change per ruling. */
  ruling?: { key: string; pros: number; def: number } | null;
  paused?: boolean;
  recess?: boolean;
  deliberating?: boolean;
  winner?: Side | "draw" | null;
}

const W = 128;
const H = 60;
const PROS_X = 13;
const DEF_X = 99;
const LAWYER_Y = 17;
const JUDGE_X = 55;
const JUDGE_Y = 11;

const CENTER: Record<Speaker, number> = { prosecutor: PROS_X + 8, defender: DEF_X + 8, judge: JUDGE_X + 9 };
const GLOW: Record<Speaker, string> = { prosecutor: "#628bff", defender: "#e16b64", judge: "#c89b55" };

export function CourtScene({ state, className = "" }: { state: SceneState; className?: string }) {
  const reduce = useReducedMotion();
  const { speaking, preparing, emotions, objection, ruling, paused, recess, deliberating, winner } = state;
  const live = !paused && !reduce;
  const mouth = useBeat(live && speaking !== null, 170);
  const gestureBeat = useBeat(live && (speaking === "prosecutor" || speaking === "defender"), 1300);

  // Faces: the objected-to lawyer looks shocked; at the verdict the winner gloats.
  const faceFor = (side: Side): Emotion => {
    if (objection === side) return "shocked";
    if (objection && objection !== side) return "smug";
    if (winner && winner !== "draw") return winner === side ? "confident" : "shocked";
    return emotions[side];
  };
  const gestureFor = (side: Side) =>
    (speaking === side && gestureBeat && faceFor(side) !== "neutral") || (winner === side) || (objection !== null && objection !== side);

  const judgeMood: JudgeMood = objection ? "stern" : deliberating || preparing === "judge" ? "thinking" : winner ? "pleased" : "neutral";
  const slam = Boolean(objection) || speaking === "judge";

  const lawyer = (side: Side) => {
    const x = side === "prosecutor" ? PROS_X : DEF_X;
    const isSpeaking = speaking === side;
    const flinch = objection === side;
    return (
      <motion.g
        key={side}
        animate={flinch && !reduce ? { x: [0, -1.5, 1.5, -1, 1, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        opacity={speaking && !isSpeaking ? 0.78 : 1}
      >
        <PixelSprite
          grid={lawyerSprite(side, { emotion: faceFor(side), talking: isSpeaking && mouth, gesture: gestureFor(side) })}
          colors={CAST_COLORS[side]}
          x={x}
          y={LAWYER_Y}
          className={isSpeaking && live ? "animate-talk" : live ? "animate-idle" : ""}
        />
      </motion.g>
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-line bg-[#0d0d10] ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" className="block h-auto w-full" role="img" aria-label={describe(state)}>
        <defs>
          {(["prosecutor", "judge", "defender"] as const).map((s) => (
            <linearGradient key={s} id={`beam-${s}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={GLOW[s]} stopOpacity="0.38" />
              <stop offset="1" stopColor={GLOW[s]} stopOpacity="0" />
            </linearGradient>
          ))}
          <radialGradient id="lamp">
            <stop offset="0" stopColor="#e6c88f" stopOpacity="0.45" />
            <stop offset="1" stopColor="#e6c88f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#263052" />
            <stop offset="1" stopColor="#151a2b" />
          </linearGradient>
        </defs>

        {/* ── Room ── */}
        <Px x={0} y={0} w={W} h={44} fill="#16151b" />
        {Array.from({ length: 9 }, (_, i) => (
          <Px key={i} x={i * 16 - 1} y={0} w={1} h={30} fill="#1d1c22" />
        ))}
        <Px x={0} y={30} w={W} h={14} fill="#1c1a1f" />
        <Px x={0} y={30} w={W} h={1} fill="#6b4c24" />
        {Array.from({ length: 16 }, (_, i) => (
          <Px key={i} x={i * 8 + 3} y={33} w={2} h={9} fill="#211f25" />
        ))}

        {/* Window behind the bench, with stars and a faint shaft of light */}
        <Px x={51} y={2} w={26} h={21} fill="#6b4c24" />
        <rect x={52} y={3} width={24} height={19} fill="url(#window)" />
        <Px x={63} y={3} w={2} h={19} fill="#6b4c24" />
        <Px x={52} y={12} w={24} h={1} fill="#6b4c24" />
        {[
          [55, 5],
          [60, 8],
          [68, 5],
          [73, 9],
          [57, 16],
          [71, 15],
        ].map(([sx, sy], i) => (
          <Px key={i} x={sx} y={sy} w={1} h={1} fill="#e8dfce" opacity={0.5 + (i % 3) * 0.2} />
        ))}
        <polygon points="52,22 76,22 92,44 36,44" fill="#9fb4ff" opacity={0.035} />

        {/* Party banners on the wall */}
        <Banner x={30} color="#628bff" dark="#3f5fc4" />
        <Banner x={92} color="#e16b64" dark="#a9463f" />

        {/* Pendant lamps */}
        {[40, 88].map((lx) => (
          <g key={lx}>
            <Px x={lx} y={0} w={1} h={5} fill="#3e3c44" />
            <Px x={lx - 2} y={5} w={5} h={2} fill="#c89b55" />
            <Px x={lx - 1} y={7} w={3} h={1} fill="#f4e2b8" />
            <circle cx={lx + 0.5} cy={8} r={11} fill="url(#lamp)" className={live ? "animate-flicker" : ""} />
          </g>
        ))}

        {/* Floor */}
        <Px x={0} y={44} w={W} h={16} fill="#121116" />
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 16 }, (_, col) =>
            (row + col) % 2 ? <Px key={`${row}-${col}`} x={col * 8} y={44 + row * 4} w={8} h={4} fill="#18171d" /> : null,
          ),
        )}

        {/* Spotlight on whoever has the floor */}
        <AnimatePresence>
          {speaking && (
            <motion.polygon
              key={speaking}
              points={beam(CENTER[speaking], speaking === "judge" ? 46 : 50)}
              fill={`url(#beam-${speaking})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>

        {/* ── Judge + bench ── */}
        <g opacity={speaking && speaking !== "judge" ? 0.85 : 1}>
          <PixelSprite
            grid={judgeSprite(judgeMood, speaking === "judge" && mouth)}
            colors={CAST_COLORS.judge}
            x={JUDGE_X}
            y={JUDGE_Y}
            className={live ? (speaking === "judge" ? "animate-talk" : "animate-idle") : ""}
          />
        </g>
        <motion.g
          // pivot at the end of the handle, so the head swings down onto the bench
          style={{ transformBox: "fill-box", originX: 0.95, originY: 0.5 }}
          animate={slam && !reduce ? { rotate: [0, -40, 12, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: objection ? 1 : 0, repeatDelay: 0.15 }}
        >
          <PixelSprite grid={GAVEL_SPRITE} colors={GAVEL_SPRITE_COLORS} x={73} y={21} />
        </motion.g>
        <Px x={42} y={25} w={44} h={19} fill="#2a2019" />
        <Px x={42} y={25} w={44} h={1} fill="#4a3626" />
        <Px x={42} y={26} w={44} h={1} fill="#c89b55" />
        <Px x={44} y={29} w={40} h={13} fill="#241b15" />
        <PixelSprite grid={SCALES} colors={{ a: "#c89b55", b: "#e6c88f" }} x={58} y={31} />

        {/* ── Lawyers + desks ── */}
        {lawyer("prosecutor")}
        {lawyer("defender")}
        <Desk x={4} color="#628bff" />
        <Desk x={92} color="#e16b64" />

        {/* Speech / thought bubbles */}
        {speaking && <Bubble x={CENTER[speaking]} y={speaking === "judge" ? 3 : 6} kind="talk" live={live} />}
        {preparing && preparing !== speaking && <Bubble x={CENTER[preparing]} y={preparing === "judge" ? 3 : 6} kind="think" live={live} />}
        {objection && <Bubble x={CENTER[objection]} y={6} kind="alert" live={live} />}
        {recess && <Bubble x={CENTER.judge} y={3} kind="sleep" live={live} />}

        {/* Floating scores after each ruling */}
        <AnimatePresence>
          {ruling && (
            <g key={ruling.key}>
              <ScorePop x={CENTER.prosecutor} value={ruling.pros} color="#8fadff" lead={ruling.pros > ruling.def} />
              <ScorePop x={CENTER.defender} value={ruling.def} color="#f09a94" lead={ruling.def > ruling.pros} />
            </g>
          )}
        </AnimatePresence>

        {/* The gallery: silhouettes in the foreground that jump on big moments */}
        {GALLERY.map((gx, i) => (
          <motion.g
            key={gx}
            animate={(objection || winner) && !reduce ? { y: [0, -2, 0, -1, 0] } : { y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          >
            <Px x={gx + 1} y={51} w={4} h={4} fill="#0a0a0d" />
            <Px x={gx} y={55} w={6} h={5} fill="#0a0a0d" />
          </motion.g>
        ))}
      </svg>

      {/* Round banner (HTML on top so the pixel font stays crisp) */}
      <AnimatePresence>
        {state.banner && !reduce && (
          <motion.div
            key={state.banner}
            className="pointer-events-none absolute inset-x-0 top-[38%] flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.2, times: [0, 0.1, 0.8, 1] }}
          >
            <motion.p
              className="border-y-2 border-gold-300 bg-bg/90 px-6 py-2 font-pixel text-sm uppercase tracking-wider text-gold-200 sm:px-10 sm:py-3 sm:text-2xl"
              initial={{ x: "-60%" }}
              animate={{ x: ["-60%", "0%", "0%", "60%"] }}
              transition={{ duration: 2.2, times: [0, 0.15, 0.8, 1], ease: "easeOut" }}
            >
              {state.banner}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/40">
          <p className="font-pixel text-lg text-ink sm:text-3xl">II Paused</p>
        </div>
      )}
    </div>
  );
}

const GALLERY = [2, 12, 22, 33, 44, 78, 89, 100, 110, 120];

function beam(cx: number, bottom: number) {
  return `${cx - 3},0 ${cx + 3},0 ${cx + 15},${bottom} ${cx - 15},${bottom}`;
}

function Banner({ x, color, dark }: { x: number; color: string; dark: string }) {
  return (
    <g>
      <Px x={x - 1} y={3} w={8} h={1} fill="#6b4c24" />
      <Px x={x} y={4} w={6} h={11} fill={color} opacity={0.8} />
      <Px x={x} y={15} w={2} h={2} fill={color} opacity={0.8} />
      <Px x={x + 4} y={15} w={2} h={2} fill={color} opacity={0.8} />
      <Px x={x + 2} y={7} w={2} h={5} fill={dark} />
    </g>
  );
}

function Desk({ x, color }: { x: number; color: string }) {
  return (
    <g>
      <Px x={x} y={37} w={32} h={10} fill="#2a2019" />
      <Px x={x} y={37} w={32} h={1} fill="#4a3626" />
      <Px x={x + 2} y={39} w={28} h={6} fill="#241b15" />
      <Px x={x + 10} y={41} w={12} h={2} fill={color} />
      {/* papers on the desk */}
      <Px x={x + 3} y={36} w={6} h={1} fill="#e8dfce" opacity={0.85} />
    </g>
  );
}

/** Pixel speech bubble. "talk" = typing dots, "think" = small cloud, "alert" = "!", "sleep" = "z". */
function Bubble({ x, y, kind, live }: { x: number; y: number; kind: "talk" | "think" | "alert" | "sleep"; live: boolean }) {
  const bx = Math.round(x - 6);
  const fill = kind === "alert" ? "#e5484d" : "#e8dfce";
  const ink = kind === "alert" ? "#e8dfce" : "#101114";
  return (
    <motion.g initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {kind === "think" ? (
        <>
          <Px x={bx + 1} y={y} w={10} h={5} fill={fill} opacity={0.85} />
          <Px x={bx + 4} y={y + 6} w={2} h={1} fill={fill} opacity={0.85} />
          <Px x={bx + 6} y={y + 8} w={1} h={1} fill={fill} opacity={0.85} />
          {[0, 1, 2].map((i) => (
            <motion.rect
              key={i}
              x={bx + 3 + i * 3}
              y={y + 2}
              width={1}
              height={1}
              fill={ink}
              animate={live ? { opacity: [0.2, 1, 0.2] } : undefined}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </>
      ) : (
        <>
          <Px x={bx} y={y} w={12} h={6} fill={fill} />
          <Px x={bx + 5} y={y + 6} w={3} h={1} fill={fill} />
          <Px x={bx + 6} y={y + 7} w={1} h={1} fill={fill} />
          {kind === "talk" &&
            [0, 1, 2].map((i) => (
              <motion.rect
                key={i}
                x={bx + 3 + i * 3}
                y={y + 2}
                width={2}
                height={2}
                fill={ink}
                animate={live ? { y: [y + 2, y + 1, y + 2] } : undefined}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          {kind === "alert" && (
            <>
              <Px x={bx + 5} y={y + 1} w={2} h={3} fill={ink} />
              <Px x={bx + 5} y={y + 5} w={2} h={1} fill={ink} />
            </>
          )}
          {kind === "sleep" && (
            <text x={bx + 3} y={y + 5} fontSize={5} fill={ink} className="font-pixel">
              z z
            </text>
          )}
        </>
      )}
    </motion.g>
  );
}

function ScorePop({ x, value, color, lead }: { x: number; value: number; color: string; lead: boolean }) {
  return (
    <motion.text
      x={x}
      textAnchor="middle"
      fontSize={lead ? 7 : 5.5}
      fill={color}
      className="font-pixel"
      style={{ paintOrder: "stroke", stroke: "#101114", strokeWidth: 1.2 }}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: [16, 10, 8, 6], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.4, times: [0, 0.15, 0.75, 1] }}
    >
      +{value}
    </motion.text>
  );
}

function describe(s: SceneState) {
  const who = { prosecutor: "the Prosecution", defender: "the Defence", judge: "the Judge" };
  if (s.winner) return `Courtroom: judgment for ${s.winner === "draw" ? "neither side" : who[s.winner]}.`;
  if (s.objection) return `Courtroom: the Judge objects to ${who[s.objection]}.`;
  if (s.speaking) return `Courtroom: ${who[s.speaking]} has the floor.`;
  if (s.preparing) return `Courtroom: ${who[s.preparing]} is preparing.`;
  return "Pixel-art courtroom with the Prosecution, the Judge and the Defence.";
}
