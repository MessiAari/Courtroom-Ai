"use client";
// The sticky docket bar (credibility scale + the three parties), round progress,
// controls, the OBJECTION band and the recess notice.

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { CourtErrorCode, Emotion, Phase, RoundScore, Side, Speaker } from "@/lib/types";
import { PARTY } from "@/lib/speakers";
import { PHASE_LABEL } from "@/lib/debate/rounds";

/** Credibility scale: a hairline tug-of-war. The marker is pulled toward the side the Judge favours. */
export function CredibilityScale({ scores }: { scores: RoundScore[] }) {
  const p = scores.reduce((s, r) => s + r.prosecutorScore, 0);
  const d = scores.reduce((s, r) => s + r.defenderScore, 0);
  const pos = Math.max(4, Math.min(96, 50 - (p - d) * 4)); // 50 = even; each point = 4%
  const leader = p === d ? null : p > d ? "pros" : "def";

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4" aria-label={`Credibility: Prosecution ${p}, Defence ${d}`}>
      <span className="font-mono text-xs text-pros tabular-nums">{String(p).padStart(2, "0")}</span>
      <div className="relative h-5">
        {/* ticks */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
        {Array.from({ length: 11 }, (_, i) => (
          <div key={i} className={`absolute top-1/2 w-px -translate-y-1/2 bg-line-strong ${i === 5 ? "h-4 bg-muted" : "h-2"}`} style={{ left: `${i * 10}%` }} />
        ))}
        {/* fill from the centre to the marker */}
        <div
          className={`absolute top-1/2 h-[3px] -translate-y-1/2 transition-all duration-700 ease-out ${leader === "pros" ? "bg-pros" : "bg-def"}`}
          style={{ left: `${Math.min(pos, 50)}%`, width: `${Math.abs(50 - pos)}%` }}
        />
        <div className="absolute top-0 h-5 w-[2px] -translate-x-1/2 bg-ink transition-[left] duration-700 ease-out" style={{ left: `${pos}%` }} />
      </div>
      <span className="font-mono text-xs text-def tabular-nums">{String(d).padStart(2, "0")}</span>
    </div>
  );
}

export type PartyStatus = "idle" | "speaking" | "preparing";

/** The three parties. The active one gets a coloured rule and a status line. */
export function Roster({ status, emotions }: { status: Record<Speaker, PartyStatus>; emotions: Record<Side, Emotion> }) {
  return (
    <div className="grid grid-cols-3 border-t border-line">
      {(["prosecutor", "judge", "defender"] as const).map((who) => {
        const p = PARTY[who];
        const s = status[who];
        const emotion = who === "judge" ? null : emotions[who];
        return (
          <div key={who} className="relative px-2 pb-2.5 pt-3 sm:px-4">
            <div
              className={`absolute inset-x-0 top-0 h-[2px] origin-left transition-all duration-300 ${p.bg} ${
                s === "idle" ? "scale-x-0" : s === "preparing" ? "scale-x-100 opacity-40" : "scale-x-100"
              }`}
            />
            <p className={`text-sm transition-colors ${s === "idle" ? "text-muted" : "text-ink"}`}>
              <span className="sm:hidden">{who === "judge" ? "Judge" : p.name}</span>
              <span className="hidden sm:inline">{p.name}</span>
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wide text-faint">
              {s === "speaking" ? (
                <span className={p.text}>
                  {who === "judge" ? "Ruling" : "Speaking"}
                  {emotion && emotion !== "neutral" ? ` · ${emotion}` : ""}
                </span>
              ) : s === "preparing" ? (
                "Preparing…"
              ) : (
                <span className="hidden sm:inline">{p.stance}</span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function RoundProgress({ phases, done, current }: { phases: Phase[]; done: Phase[]; current: Phase | "verdict" | null }) {
  const all: (Phase | "verdict")[] = [...phases, "verdict"];
  return (
    <ol className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-wide">
      {all.map((p, i) => {
        const isCurrent = p === current;
        const isDone = p !== "verdict" && done.includes(p);
        return (
          <li key={p} className={isCurrent ? "text-ink" : isDone ? "text-muted" : "text-faint"}>
            <span className={isCurrent ? "text-brass" : ""}>{String(i + 1).padStart(2, "0")}</span>{" "}
            {p === "verdict" ? "Judgment" : p === "cross" ? "Cross-exam" : PHASE_LABEL[p]}
            {isDone && " ✓"}
          </li>
        );
      })}
    </ol>
  );
}

const ctrl = "text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:pointer-events-none disabled:opacity-35";

export function Controls(p: {
  paused: boolean;
  canPause: boolean;
  canSkip: boolean;
  voiceOn: boolean;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onRestart: () => void;
  onToggleVoice: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {p.paused ? (
        <button className={`${ctrl} text-ink`} onClick={p.onResume}>Resume</button>
      ) : (
        <button className={ctrl} onClick={p.onPause} disabled={!p.canPause}>Pause</button>
      )}
      <button className={ctrl} onClick={p.onSkip} disabled={!p.canSkip}>Skip to judgment</button>
      <button className={ctrl} onClick={p.onRestart}>Restart</button>
      <button className={ctrl} onClick={p.onToggleVoice} aria-pressed={p.voiceOn}>
        Voices: {p.voiceOn ? "on" : "off"}
      </button>
    </div>
  );
}

/** Full-width red band shown when the Judge objects to a fallacy. */
export function ObjectionBand({ by, type }: { by: Side | null; type?: string }) {
  return (
    <AnimatePresence>
      {by && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-[38%] z-50 bg-pros py-6 text-bg sm:py-9"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          role="alert"
        >
          <motion.div
            className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-1 px-5"
            initial={{ x: -40 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="font-serif text-6xl italic leading-none sm:text-8xl">Objection.</p>
            <p className="font-mono text-xs uppercase tracking-wide sm:text-sm">
              {type} — by the {by === "prosecutor" ? "Prosecution" : "Defence"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Shown when every provider failed or keys are missing. Everything argued so far stays on the record. */
export function RecessNotice({ code, onRetry }: { code: CourtErrorCode | null; onRetry: () => void }) {
  return (
    <div className="grid gap-x-6 gap-y-3 border-t border-line py-7 sm:grid-cols-[7.5rem_1fr]">
      <p className="font-mono text-[11px] uppercase tracking-wide text-brass">Recess</p>
      <div>
        {code === "missing_keys" ? (
          <>
            <p className="font-serif text-2xl">The court isn&apos;t set up yet.</p>
            <p className="mt-2 text-sm text-muted">The AI API keys haven&apos;t been configured on this server.</p>
            <Link href="/setup" className="mt-4 inline-block bg-ink px-5 py-2 text-sm text-bg hover:bg-brass">
              See setup steps
            </Link>
          </>
        ) : (
          <>
            <p className="font-serif text-2xl">The court is in recess. Try again in a minute.</p>
            <p className="mt-2 text-sm text-muted">
              {code === "invalid_input"
                ? "The court couldn't accept that request — try restarting the case."
                : "The AI counsel couldn't be reached. Everything argued so far is kept on the record."}
            </p>
            <button onClick={onRetry} className="mt-4 bg-ink px-5 py-2 text-sm text-bg hover:bg-brass">
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
