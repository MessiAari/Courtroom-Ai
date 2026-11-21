"use client";
// The bench bar (pixel credibility meter + the three parties), round progress,
// controls, the OBJECTION overlay and the recess notice.

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FastForward, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { CourtErrorCode, Emotion, Phase, RoundScore, Side, Speaker } from "@/lib/types";
import { PARTY } from "@/lib/speakers";
import { PHASE_LABEL } from "@/lib/debate/rounds";
import { PixelMeter } from "@/components/ui/PixelMeter";
import { PixelArt } from "@/components/ui/PixelArt";
import { GAVEL, GAVEL_COLORS } from "@/components/ui/pixel-icons";
import { buttonClass } from "@/components/ui/primitives";
import { PixelLoader } from "./Record";

/** Credibility meter fed by the Judge's round scores. */
export function CredibilityScale({ scores }: { scores: RoundScore[] }) {
  const p = scores.reduce((s, r) => s + r.prosecutorScore, 0);
  const d = scores.reduce((s, r) => s + r.defenderScore, 0);
  return <PixelMeter prosecution={p} defence={d} />;
}

export type PartyStatus = "idle" | "speaking" | "preparing";

/** The three parties. The active one lights up in its colour. */
export function Roster({ status, emotions }: { status: Record<Speaker, PartyStatus>; emotions: Record<Side, Emotion> }) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-line">
      {(["prosecutor", "judge", "defender"] as const).map((who) => {
        const p = PARTY[who];
        const s = status[who];
        const emotion = who === "judge" ? null : emotions[who];
        return (
          <div
            key={who}
            className={`relative flex items-center gap-1.5 border-r border-line px-2 py-2 transition-colors duration-300 last:border-r-0 sm:gap-3 sm:px-4 sm:py-2.5`}
            style={s === "speaking" ? { background: `${p.color}24` } : s === "preparing" ? { background: `${p.color}0f` } : undefined}
          >
            <div
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left transition-transform duration-300"
              style={{ background: p.color, transform: `scaleX(${s === "idle" ? 0 : 1})`, opacity: s === "preparing" ? 0.5 : 1 }}
            />
            <PixelArt bitmap={p.icon} colors={p.iconColors} className={`h-4 w-4 shrink-0 sm:h-6 sm:w-6 ${s === "speaking" ? "animate-bob" : s === "idle" ? "opacity-50" : ""}`} />
            <div className="min-w-0">
              <p className={`truncate text-[11px] font-semibold sm:text-sm ${s === "idle" ? "text-muted" : "text-ink"}`}>
                {who === "judge" ? <><span className="sm:hidden">Judge</span><span className="hidden sm:inline">The Judge</span></> : p.name}
              </p>
              <p className="flex h-4 items-center truncate font-mono text-[10px] uppercase tracking-wider text-faint">
                {s === "speaking" ? (
                  <span className={p.text}>
                    {who === "judge" ? "Ruling" : "Speaking"}
                    <span className="hidden sm:inline">{emotion && emotion !== "neutral" ? ` · ${emotion}` : ""}</span>
                  </span>
                ) : s === "preparing" ? (
                  <PixelLoader color={p.color} />
                ) : (
                  <span className="hidden sm:inline">{p.stance}</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Stepped progress: one segment per round, plus Judgment. */
export function RoundProgress({ phases, done, current }: { phases: Phase[]; done: Phase[]; current: Phase | "verdict" | null }) {
  const all: (Phase | "verdict")[] = [...phases, "verdict"];
  return (
    <ol className="flex w-full gap-1.5 sm:max-w-xl" aria-label="Round progress">
      {all.map((p, i) => {
        const isCurrent = p === current;
        const isDone = p !== "verdict" && done.includes(p);
        return (
          <li key={p} className="min-w-0 flex-1" aria-current={isCurrent ? "step" : undefined}>
            <div className="h-1.5 overflow-hidden bg-line">
              <motion.div
                className="h-full"
                style={{ background: isDone ? "#34D399" : "#059669" }}
                initial={false}
                animate={{ width: isDone ? "100%" : isCurrent ? "55%" : "0%" }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className={`mt-2 truncate font-mono text-[10px] uppercase tracking-wider ${isCurrent ? "text-ink" : isDone ? "text-muted" : "text-faint"}`}>
              <span className="font-pixel">{String(i + 1).padStart(2, "0")}</span> {p === "verdict" ? "Judgment" : p === "cross" ? "Cross" : PHASE_LABEL[p]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

const iconBtn = `${buttonClass("secondary")} !px-3 !py-2 text-xs`;

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
    <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-nowrap">
      {p.paused ? (
        <button className={`${buttonClass("primary")} !px-3 !py-2 text-xs`} onClick={p.onResume}>
          <Play className="h-3.5 w-3.5" /> Resume
        </button>
      ) : (
        <button className={iconBtn} onClick={p.onPause} disabled={!p.canPause}>
          <Pause className="h-3.5 w-3.5" /> Pause
        </button>
      )}
      <button className={iconBtn} onClick={p.onSkip} disabled={!p.canSkip} title="Jump straight to the Judge's verdict">
        <FastForward className="h-3.5 w-3.5" /> <span className="sm:hidden">Skip</span><span className="hidden sm:inline">Skip to judgment</span>
      </button>
      <button className={iconBtn} onClick={p.onRestart} title="Restart the hearing">
        <RotateCcw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Restart</span>
      </button>
      <button className={iconBtn} onClick={p.onToggleVoice} aria-pressed={p.voiceOn} title="Character voices (browser speech)">
        {p.voiceOn ? <Volume2 className="h-3.5 w-3.5 text-accent" /> : <VolumeX className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{p.voiceOn ? "Voices on" : "Muted"}</span>
      </button>
    </div>
  );
}

const STRIPES = ["#6EE7B7", "#34D399", "#10B981", "#059669", "#047857"];

/** Full-width stepped-spectrum band shown when the Judge objects to a fallacy. */
export function ObjectionBand({ by, type }: { by: Side | null; type?: string }) {
  return (
    <AnimatePresence>
      {by && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-[34%] z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alert"
        >
          <div className="flex flex-col">
            {STRIPES.map((c, i) => (
              <motion.div
                key={c}
                className="h-3 origin-left sm:h-4"
                style={{ background: c }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0, originX: 1 }}
                transition={{ duration: 0.28, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
              />
            ))}
          </div>
          <motion.div
            className="bg-accent py-5 text-bg sm:py-7"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
          >
            <motion.div
              className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-8 gap-y-2 px-5 sm:px-8"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: [-60, 8, -4, 0], opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.18 }}
            >
              <p className="font-pixel text-5xl font-bold leading-none sm:text-8xl">OBJECTION!</p>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider sm:text-sm">
                {type} — by the {by === "prosecutor" ? "Prosecution" : "Defence"}
              </p>
            </motion.div>
          </motion.div>
          <div className="flex flex-col">
            {[...STRIPES].reverse().map((c, i) => (
              <motion.div
                key={c}
                className="ml-auto h-3 origin-right sm:h-4"
                style={{ background: c, width: `${100 - i * 12}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.28, delay: 0.1 + i * 0.04 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Shown when every provider failed or keys are missing. Everything argued so far stays on the record. */
export function RecessNotice({ code, onRetry }: { code: CourtErrorCode | null; onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-accent/40 bg-accent/[0.06] p-5 sm:flex-row sm:items-center sm:p-7" role="alert">
      <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} className="h-12 w-12 shrink-0" />
      <div className="flex-1">
        {code === "missing_keys" ? (
          <>
            <p className="text-xl font-semibold tracking-tight">The court isn&apos;t set up yet.</p>
            <p className="mt-1 text-sm text-muted">The AI API keys haven&apos;t been configured on this server.</p>
          </>
        ) : (
          <>
            <p className="text-xl font-semibold tracking-tight">The court is in recess. Try again in a minute.</p>
            <p className="mt-1 text-sm text-muted">
              {code === "invalid_input"
                ? "The court couldn't accept that request — try restarting the case."
                : "The AI counsel couldn't be reached. Everything argued so far is kept on the record."}
            </p>
          </>
        )}
      </div>
      {code === "missing_keys" ? (
        <Link href="/setup" className={buttonClass("primary")}>See setup steps</Link>
      ) : (
        <button onClick={onRetry} className={buttonClass("primary")}>
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
      )}
    </div>
  );
}
