"use client";
// The hearing. Connects the debate loop (useDebate) to the "live court record":
// a sticky docket bar (credibility scale + parties), the numbered record of
// statements and rulings, the OBJECTION band, controls — and, once the
// verdict arrives, the judgment and the Ask the Judge chat.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
import type { DebateMode, Emotion, Phase, Side, Speaker } from "@/lib/types";
import { useDebate, type StepResult } from "@/lib/debate/useDebate";
import { PHASE_LABEL, phasesFor } from "@/lib/debate/rounds";
import { pauseSpeaking, resumeSpeaking, stopSpeaking } from "@/lib/speech";
import { saveToHistory } from "@/lib/history";
import { LiveEntry, PendingEntry, StaticEntry, type EntryData } from "./Record";
import { Controls, CredibilityScale, ObjectionBand, RecessNotice, Roster, RoundProgress, type PartyStatus } from "./Docket";
import { Judgment } from "@/components/verdict/Judgment";
import { AskTheJudge } from "@/components/chat/AskTheJudge";

const KIND_LABEL = { statement: "", question: " · Question", answer: " · Answer" } as const;

/** Turns debate results into numbered record entries. */
function toEntries(results: StepResult[]): EntryData[] {
  const entries: EntryData[] = [];
  results.forEach((r, i) => {
    if (r.kind === "turn") {
      const t = r.turn;
      entries.push({
        id: `r${i}`,
        no: entries.length + 2, // entry 01 is the Judge's opening line
        speaker: t.speaker,
        label: `${PHASE_LABEL[t.phase]}${KIND_LABEL[t.kind]}`,
        text: t.text,
        emotion: t.emotion,
        provider: t.provider,
      });
    } else if (r.kind === "score") {
      const s = r.score;
      const outcome =
        s.prosecutorScore === s.defenderScore
          ? `The ${PHASE_LABEL[s.phase].toLowerCase()} round is even`
          : `The ${PHASE_LABEL[s.phase].toLowerCase()} round goes to the ${s.prosecutorScore > s.defenderScore ? "Prosecution" : "Defence"}`;
      const objection = s.fallacy ? `“${s.fallacy.quote}” — that is a ${s.fallacy.type}, and it costs points. ` : "";
      entries.push({
        id: `r${i}`,
        no: entries.length + 2,
        speaker: "judge",
        label: `Ruling · ${PHASE_LABEL[s.phase]}`,
        text: `${objection}${outcome}: Prosecution ${s.prosecutorScore}, Defence ${s.defenderScore}.`,
        provider: s.provider,
        fallacy: s.fallacy,
      });
    }
  });
  return entries;
}

export function Courtroom({ topic, mode, caseId }: { topic: string; mode: DebateMode; caseId?: string }) {
  const debate = useDebate({ topic, mode, caseId });
  const [voiceOn, setVoiceOn] = useState(false); // muted by default
  const [introDone, setIntroDone] = useState(false); // the Judge's opening line plays first
  const [objectionDismissed, setObjectionDismissed] = useState(-1); // index of the last ruling whose band finished
  const [fullRecord, setFullRecord] = useState(true); // collapsible transcript
  const shake = useAnimationControls();

  const { current, results, status, visible } = debate;
  const paused = status === "paused";
  const index = current ? results.indexOf(current) : -1;
  const verdict = current?.kind === "verdict" ? current.verdict : null;

  // On phones, start with only the current statement showing (one at a time).
  useEffect(() => {
    const id = requestAnimationFrame(() => setFullRecord(!window.matchMedia("(max-width: 639px)").matches));
    return () => cancelAnimationFrame(id);
  }, []);

  // Record entries: everything shown so far; the last one is "live" if it's the current result.
  const entries = useMemo(() => toEntries(visible), [visible]);
  const liveEntry = introDone && current && current.kind !== "verdict" ? entries[entries.length - 1] : null;
  const pastEntries = liveEntry ? entries.slice(0, -1) : entries;

  // OBJECTION band + a small shake while a ruling with a fallacy is current.
  const fallacy = introDone && current?.kind === "score" ? current.score.fallacy : null;
  const objection = fallacy && objectionDismissed !== index ? fallacy : null;
  useEffect(() => {
    if (!fallacy) return;
    shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.45 } });
    const t = setTimeout(() => setObjectionDismissed(index), 1700);
    return () => clearTimeout(t);
  }, [fallacy, index, shake]);

  // Keep the browser voice in sync with pause / mute.
  useEffect(() => {
    if (paused) pauseSpeaking();
    else resumeSpeaking();
  }, [paused]);
  useEffect(() => {
    if (!voiceOn) stopSpeaking();
  }, [voiceOn]);
  useEffect(() => () => stopSpeaking(), []);

  // Save finished hearings to localStorage history (optional feature).
  useEffect(() => {
    if (!verdict) return;
    saveToHistory({
      topic,
      mode,
      caseId,
      winner: verdict.winner,
      prosecutorScore: verdict.prosecutorScore,
      defenderScore: verdict.defenderScore,
      date: new Date().toISOString(),
    });
  }, [verdict, topic, mode, caseId]);

  const shownScores = useMemo(() => visible.flatMap((r) => (r.kind === "score" ? [r.score] : [])), [visible]);
  const emotions = useMemo(() => {
    const e: Record<Side, Emotion> = { prosecutor: "neutral", defender: "neutral" };
    for (const r of visible) if (r.kind === "turn") e[r.turn.speaker] = r.turn.emotion;
    return e;
  }, [visible]);

  // Who is speaking / preparing right now?
  const upcoming = debate.upcoming;
  const upcomingSpeaker: Speaker | null = upcoming ? (upcoming.type === "turn" ? upcoming.speaker : "judge") : null;
  const speaking: Speaker | null = !introDone ? "judge" : (liveEntry?.speaker ?? null);
  const preparing = introDone && !liveEntry && debate.fetching ? upcomingSpeaker : null;
  const partyStatus = (who: Speaker): PartyStatus => (speaking === who ? "speaking" : preparing === who ? "preparing" : "idle");

  const phases = phasesFor(mode);
  const currentPhase: Phase | "verdict" | null =
    current?.kind === "turn"
      ? current.turn.phase
      : current?.kind === "score"
        ? current.score.phase
        : upcoming?.type === "verdict" || verdict
          ? "verdict"
          : upcoming
            ? upcoming.phase
            : null;

  const pendingText =
    upcoming?.type === "verdict"
      ? "The court is deliberating"
      : upcoming?.type === "judge"
        ? "Weighing the round"
        : upcoming?.type === "turn"
          ? upcoming.kind === "question"
            ? "Preparing a question"
            : upcoming.kind === "answer"
              ? "Preparing an answer"
              : "Preparing an argument"
          : "One moment";

  const intro: EntryData = {
    id: "intro",
    no: 1,
    speaker: "judge",
    label: "Opening of court",
    text: `Order. The court will hear the case: “${topic}”. The Prosecution argues for the motion, the Defence against. Prosecution, you may begin.`,
  };

  const restart = () => {
    stopSpeaking();
    setIntroDone(false);
    debate.restart();
  };

  // ── Judgment view ─────────────────────────────────────────────
  if (verdict) {
    return (
      <div className="mx-auto max-w-6xl px-5 pb-10">
        <Judgment verdict={verdict} topic={topic} mode={mode} />
        <AskTheJudge topic={topic} caseId={caseId} turns={debate.turns} scores={debate.scores} verdict={verdict} />
        <details className="group mt-16 border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5">
            <span className="label">Full record · {entries.length + 1} entries</span>
            <span className="text-sm text-muted group-open:hidden">Show</span>
            <span className="hidden text-sm text-muted group-open:inline">Hide</span>
          </summary>
          <StaticEntry entry={intro} />
          {entries.map((e) => (
            <StaticEntry key={e.id} entry={e} />
          ))}
        </details>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
          <Link href="/file" className="bg-ink px-6 py-3 text-sm font-medium text-bg hover:bg-brass">
            File a new case →
          </Link>
          <button onClick={restart} className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            Re-hear this case
          </button>
        </div>
      </div>
    );
  }

  // ── Hearing view ──────────────────────────────────────────────
  return (
    <div className="pb-10">
      <ObjectionBand by={objection?.by ?? null} type={objection?.type} />

      {/* Case caption */}
      <div className="mx-auto max-w-6xl px-5 pt-10">
        <p className="label">
          In session · {mode === "full" ? "Full hearing" : "Quick hearing"}
          {caseId ? " · From the case library" : ""}
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.05] sm:text-6xl">{topic}</h1>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <RoundProgress phases={phases} done={shownScores.map((s) => s.phase)} current={currentPhase} />
          <Controls
            paused={paused}
            canPause={status === "running"}
            canSkip={debate.canSkip}
            voiceOn={voiceOn}
            onPause={debate.pause}
            onResume={debate.resume}
            onSkip={debate.skip}
            onRestart={restart}
            onToggleVoice={() => setVoiceOn((v) => !v)}
          />
        </div>
      </div>

      {/* Sticky docket bar */}
      <div className="sticky top-14 z-30 mt-8 border-y border-line bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 pt-3">
          <CredibilityScale scores={shownScores} />
        </div>
        <div className="mx-auto mt-3 max-w-6xl px-3 sm:px-1">
          <Roster
            status={{ prosecutor: partyStatus("prosecutor"), judge: partyStatus("judge"), defender: partyStatus("defender") }}
            emotions={emotions}
          />
        </div>
      </div>

      {/* The record */}
      <motion.div animate={shake} className="mx-auto max-w-6xl px-5 pt-4">
        <div className="flex items-center justify-between py-3">
          <p className="label">The record</p>
          {pastEntries.length > 0 && introDone && (
            <button onClick={() => setFullRecord((f) => !f)} className="label underline-offset-4 hover:text-ink hover:underline">
              {fullRecord ? "Show current only" : `Show full record (${pastEntries.length + 1})`}
            </button>
          )}
        </div>

        {!introDone ? (
          <LiveEntry entry={intro} paused={paused} voiceOn={voiceOn} holdMs={900} onDone={() => setIntroDone(true)} />
        ) : (
          <>
            {fullRecord && (
              <>
                <StaticEntry entry={intro} dim />
                {pastEntries.map((e) => (
                  <StaticEntry key={e.id} entry={e} dim />
                ))}
              </>
            )}
            {liveEntry && current ? (
              <LiveEntry
                key={liveEntry.id}
                entry={liveEntry}
                paused={paused}
                voiceOn={voiceOn}
                startDelay={fallacy ? 1800 : 0}
                holdMs={liveEntry.speaker === "judge" ? 1500 : 1800}
                onDone={debate.markShown}
              />
            ) : status === "recess" ? (
              <RecessNotice code={debate.error} onRetry={debate.retry} />
            ) : (
              <PendingEntry speaker={upcomingSpeaker ?? "judge"} text={paused ? "Court adjourned — paused" : pendingText} />
            )}
          </>
        )}

        {status === "recess" && liveEntry && <RecessNotice code={debate.error} onRetry={debate.retry} />}
        {paused && <p className="label border-t border-line py-4 text-brass">Court adjourned — press Resume to continue</p>}
      </motion.div>
    </div>
  );
}
