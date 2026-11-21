"use client";
// Entries in the live court record. A finished entry is static; the current one
// types itself out (and is optionally spoken), then tells the debate loop it's done.

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Emotion, Fallacy, Speaker } from "@/lib/types";
import { PARTY } from "@/lib/speakers";
import { speak } from "@/lib/speech";
import { PixelArt } from "@/components/ui/PixelArt";

export interface EntryData {
  id: string;
  no: number;
  speaker: Speaker;
  label: string; // e.g. "Opening" or "Ruling · Rebuttal"
  text: string;
  emotion?: Emotion;
  provider?: string;
  fallacy?: Fallacy | null;
  scores?: [number, number]; // for Judge rulings: [prosecution, defence]
}

const CHARS_PER_TICK = 2;
const TICK_MS = 26; // ≈ 75 characters per second

/** Highlights evidence tags like [E2] as small pixel chips. */
function withEvidence(text: string) {
  return text.split(/(\[E\d+\])/g).map((part, i) =>
    /^\[E\d+\]$/.test(part) ? (
      <span key={i} className="mx-0.5 inline-block -translate-y-0.5 rounded-sm bg-accent/15 px-1.5 py-0.5 align-middle font-pixel text-[0.55em] text-accent">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

/** Square avatar with the party's pixel icon. */
export function PartyAvatar({ speaker, active = false, size = "md" }: { speaker: Speaker; active?: boolean; size?: "sm" | "md" }) {
  const p = PARTY[speaker];
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-md border ${size === "md" ? "h-11 w-11" : "h-8 w-8"}`}
      style={{ background: `${p.color}1a`, borderColor: `${p.color}55` }}
    >
      <PixelArt bitmap={p.icon} colors={p.iconColors} className={`${size === "md" ? "h-6 w-6" : "h-4 w-4"} ${active ? "animate-bob" : ""}`} />
    </div>
  );
}

/** The visual layout shared by static and live entries. */
function EntryShell({ entry, live, dim, children }: { entry: EntryData; live?: boolean; dim?: boolean; children: React.ReactNode }) {
  const p = PARTY[entry.speaker];
  const objection = entry.speaker === "judge" && entry.fallacy;
  return (
    <article
      className={`relative flex gap-4 rounded-xl border p-4 transition-all duration-500 sm:gap-5 sm:p-6 ${
        objection ? "border-accent/50 bg-accent/[0.07]" : live ? "bg-surface" : "border-transparent"
      } ${dim ? "opacity-55 hover:opacity-100" : ""}`}
      style={live && !objection ? { borderColor: `${p.color}66` } : undefined}
    >
      {live && <div className="absolute left-0 top-6 h-8 w-[3px] rounded-r" style={{ background: p.color }} aria-hidden />}
      <PartyAvatar speaker={entry.speaker} active={live} />
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className={`text-sm font-semibold ${p.text}`}>{p.name}</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{entry.label}</span>
          {entry.emotion && entry.emotion !== "neutral" && (
            <span className="rounded-sm border border-line-strong px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
              {entry.emotion}
            </span>
          )}
          <span className="ml-auto font-pixel text-xs text-faint">{String(entry.no).padStart(2, "0")}</span>
        </header>
        {objection && (
          <p className="mt-2 font-pixel text-sm uppercase text-accent">
            Objection sustained · {entry.fallacy!.type} · {entry.fallacy!.by === "prosecutor" ? "Prosecution" : "Defence"}
          </p>
        )}
        {children}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {entry.scores && (
            <>
              <span className="rounded-sm bg-pros/15 px-2 py-1 font-pixel text-xs text-pros">PROS {entry.scores[0]}</span>
              <span className="rounded-sm bg-def/15 px-2 py-1 font-pixel text-xs text-def">DEF {entry.scores[1]}</span>
            </>
          )}
          {entry.provider && <span className="font-mono text-[10px] uppercase tracking-wider text-faint">via {entry.provider}</span>}
        </div>
      </div>
    </article>
  );
}

function textClass(speaker: Speaker) {
  return speaker === "judge"
    ? "mt-2 text-base leading-relaxed text-ink/90 sm:text-lg"
    : "mt-2 text-[1.2rem] font-medium leading-snug tracking-tight text-ink sm:text-[1.4rem] lg:text-[1.3rem]";
}

export function StaticEntry({ entry, dim }: { entry: EntryData; dim?: boolean }) {
  return (
    <EntryShell entry={entry} dim={dim}>
      <p className={textClass(entry.speaker)}>{withEvidence(entry.text)}</p>
    </EntryShell>
  );
}

/** The entry being "spoken" right now: typewriter + optional voice, then onDone after a reading pause. */
export function LiveEntry({
  entry,
  paused,
  voiceOn,
  startDelay = 0,
  holdMs = 1800,
  onDone,
}: {
  entry: EntryData;
  paused: boolean;
  voiceOn: boolean;
  startDelay?: number;
  holdMs?: number;
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? entry.text.length : 0);
  const [started, setStarted] = useState(startDelay === 0);
  const [spoken, setSpoken] = useState(false);
  const speechDone = spoken || !voiceOn; // muting mid-line stops us waiting for the voice
  const typed = count >= entry.text.length;
  const ref = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  // Bring the new entry into view.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }, [reduce]);

  // Optional delay (e.g. while the OBJECTION band is on screen).
  useEffect(() => {
    if (started) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [started, startDelay]);

  // Speak the line once when it starts.
  useEffect(() => {
    if (!started || !voiceOn) return;
    let alive = true;
    speak(entry.text, entry.speaker).then(() => alive && setSpoken(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- speak once per entry
  }, [started]);

  // Typewriter: reveal a few characters per tick (frozen while paused).
  useEffect(() => {
    if (!started || paused || typed) return;
    const t = setInterval(() => setCount((c) => Math.min(entry.text.length, c + CHARS_PER_TICK)), TICK_MS);
    return () => clearInterval(t);
  }, [started, paused, typed, entry.text.length]);

  // When typing and speech have finished, pause briefly so it can be read, then move on.
  useEffect(() => {
    if (!typed || !speechDone || paused) return;
    const extra = reduce ? entry.text.length * 25 : 0;
    const t = setTimeout(() => onDoneRef.current(), holdMs + extra);
    return () => clearTimeout(t);
  }, [typed, speechDone, paused, holdMs, reduce, entry.text.length]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      aria-live="polite"
      className="scroll-mt-56"
    >
      <EntryShell live entry={{ ...entry, provider: typed ? entry.provider : undefined, scores: typed ? entry.scores : undefined }}>
        <p className={`${textClass(entry.speaker)} ${started && !typed ? "caret" : ""}`}>{withEvidence(entry.text.slice(0, count))}</p>
      </EntryShell>
    </motion.div>
  );
}

/** Pixel loader: three blocks lighting up in turn. */
export function PixelLoader({ color }: { color: string }) {
  return (
    <span className="inline-flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2"
          style={{ background: color }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "linear" }}
        />
      ))}
    </span>
  );
}

/** Placeholder while an agent is preparing its reply. */
export function PendingEntry({ speaker, text }: { speaker: Speaker; text: string }) {
  const p = PARTY[speaker];
  return (
    <div className="flex items-center gap-4 rounded-xl border border-dashed border-line-strong p-4 sm:gap-5 sm:p-6">
      <PartyAvatar speaker={speaker} />
      <div>
        <p className={`text-sm font-semibold ${p.text}`}>{p.name}</p>
        <p className="mt-1 flex items-center gap-3 text-muted">
          {text}
          <PixelLoader color={p.color} />
        </p>
      </div>
    </div>
  );
}
