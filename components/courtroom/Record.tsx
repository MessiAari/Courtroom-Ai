"use client";
// Entries in the live court record. A finished entry is static; the current one
// types itself out (and is optionally spoken), then tells the debate loop it's done.

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Emotion, Fallacy, Speaker } from "@/lib/types";
import { PARTY } from "@/lib/speakers";
import { speak } from "@/lib/speech";

export interface EntryData {
  id: string;
  no: number;
  speaker: Speaker;
  label: string; // e.g. "Opening" or "Ruling · Rebuttal"
  text: string;
  emotion?: Emotion;
  provider?: string;
  fallacy?: Fallacy | null;
}

const CHARS_PER_TICK = 2;
const TICK_MS = 26; // ≈ 75 characters per second

/** Highlights evidence tags like [E2]. */
function withEvidence(text: string) {
  return text.split(/(\[E\d+\])/g).map((part, i) =>
    /^\[E\d+\]$/.test(part) ? (
      <sup key={i} className="ml-0.5 font-mono text-[0.45em] text-brass">
        {part.slice(1, -1)}
      </sup>
    ) : (
      part
    ),
  );
}

/** The visual layout shared by static and live entries. */
function EntryShell({ entry, dim, children }: { entry: EntryData; dim?: boolean; children: React.ReactNode }) {
  const p = PARTY[entry.speaker];
  const isJudge = entry.speaker === "judge";
  return (
    <article
      className={`grid gap-x-6 gap-y-2 border-t border-line py-7 transition-opacity duration-500 sm:grid-cols-[7.5rem_1fr] ${
        dim ? "opacity-55 hover:opacity-100" : ""
      }`}
    >
      <header className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-wide sm:block">
        <span className="text-faint">{String(entry.no).padStart(2, "0")}</span>
        <span className={`sm:mt-2 sm:block ${p.text}`}>{p.name}</span>
        <span className="text-faint sm:mt-1 sm:block">{entry.label}</span>
        {entry.emotion && entry.emotion !== "neutral" && <span className="text-faint sm:mt-1 sm:block">— {entry.emotion}</span>}
      </header>
      <div className={isJudge && entry.fallacy ? "border-l-2 border-pros pl-4" : ""}>
        {isJudge && entry.fallacy && (
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-pros">
            Objection sustained · {entry.fallacy.type} · {entry.fallacy.by === "prosecutor" ? "Prosecution" : "Defence"}
          </p>
        )}
        {children}
        {entry.provider && <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-faint">via {entry.provider}</p>}
      </div>
    </article>
  );
}

function textClass(speaker: Speaker) {
  return speaker === "judge"
    ? "text-base leading-relaxed text-ink/90 sm:text-lg"
    : "font-serif text-[1.6rem] leading-[1.25] text-ink sm:text-[2rem]";
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
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} aria-live="polite">
      <EntryShell entry={{ ...entry, provider: typed ? entry.provider : undefined }}>
        <p className={`${textClass(entry.speaker)} ${started && !typed ? "caret" : ""}`}>{withEvidence(entry.text.slice(0, count))}</p>
      </EntryShell>
    </motion.div>
  );
}

/** Placeholder while an agent is preparing its reply. */
export function PendingEntry({ speaker, text }: { speaker: Speaker; text: string }) {
  const p = PARTY[speaker];
  return (
    <div className="grid gap-x-6 gap-y-2 border-t border-line py-7 sm:grid-cols-[7.5rem_1fr]">
      <p className={`font-mono text-[11px] uppercase tracking-wide ${p.text}`}>{p.name}</p>
      <p className="flex items-center gap-3 text-muted">
        {text}
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={`h-1 w-1 ${p.bg}`}
              animate={{ opacity: [0.15, 1, 0.15] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </span>
      </p>
    </div>
  );
}
