"use client";
// The hearing. Connects the debate loop (useDebate) to the "live court record":
// a sticky docket bar (credibility scale + parties), the numbered record of
// statements and rulings, the OBJECTION band, controls — and, once the
// verdict arrives, the judgment and the Ask the Judge chat.

import { useEffect, useMemo, useState } from "react";
import { ButtonLink, buttonClass } from "@/components/ui/primitives";
import { motion, useAnimationControls } from "framer-motion";
import type { CaseFact, DebateMode, Emotion, Phase, Side, Speaker } from "@/lib/types";
import { useDebate, type StepResult } from "@/lib/debate/useDebate";
import { PHASE_LABEL, phasesFor } from "@/lib/debate/rounds";
import { pauseSpeaking, resumeSpeaking, stopSpeaking } from "@/lib/speech";
import { saveToHistory } from "@/lib/history";
import { LiveEntry, PendingEntry, StaticEntry, type EntryData } from "./Record";
import { Controls, CredibilityScale, ObjectionBand, RecessNotice, Roster, RoundProgress, type PartyStatus } from "./Docket";
import { Judgment } from "@/components/verdict/Judgment";
import { AskTheJudge } from "@/components/chat/AskTheJudge";
import { CourtScene, type SceneState } from "@/components/court/CourtScene";
import { EvidenceBadge, EvidenceContext, ExhibitsPanel } from "./Evidence";

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
        scores: [s.prosecutorScore, s.defenderScore],
      });
    }
  });
  return entries;
}

export function Courtroom({ topic, mode, caseId, libraryEvidence }: { topic: string; mode: DebateMode; caseId?: string; libraryEvidence?: CaseFact[] }) {
  const debate = useDebate({ topic, mode, caseId, libraryEvidence });
  const [voiceOn, setVoiceOn] = useState(false); // muted by default
  const [introDone, setIntroDone] = useState(false); // the Judge's opening line plays first
  const [objectionDismissed, setObjectionDismissed] = useState(-1); // index of the last ruling whose band finished
  const [fullRecord, setFullRecord] = useState(true); // collapsible transcript
  const [exhibitsOpen, setExhibitsOpen] = useState(true); // exhibits list starts open on desktop, closed on phones
  const shake = useAnimationControls();

  const { current, results, status, visible } = debate;
  const paused = status === "paused";
  const index = current ? results.indexOf(current) : -1;
  const verdict = current?.kind === "verdict" ? current.verdict : null;

  // On phones, start with only the current statement showing (one at a time).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const desktop = !window.matchMedia("(max-width: 639px)").matches;
      setFullRecord(desktop);
      setExhibitsOpen(desktop);
    });
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
  // While the clerk researches evidence, the Judge "thinks"; otherwise whoever is fetching their turn.
  const preparing = introDone && !liveEntry ? (debate.researching ? "judge" : debate.fetching ? upcomingSpeaker : null) : null;
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

  const pendingText = debate.researching
    ? "The clerk is gathering evidence from the web"
    : upcoming?.type === "verdict"
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
    // Don't add a full stop after a topic that already ends in "?", "!" or ".".
    text: `Order. The court will hear the case: “${topic}”${/[.?!]$/.test(topic) ? "" : "."} The Prosecution argues for the motion, the Defence against. Prosecution, you may begin.`,
  };

  // State for the pixel-art courtroom scene.
  const roundNo = currentPhase && currentPhase !== "verdict" ? phases.indexOf(currentPhase) + 1 : 0;
  const scene: SceneState = {
    speaking,
    preparing,
    emotions,
    banner: !introDone
      ? null
      : currentPhase === "verdict"
        ? "Judgment"
        : currentPhase
          ? `Round ${String(roundNo).padStart(2, "0")} · ${PHASE_LABEL[currentPhase]}`
          : null,
    objection: objection?.by ?? null,
    ruling: introDone && current?.kind === "score" ? { key: `r${index}`, pros: current.score.prosecutorScore, def: current.score.defenderScore } : null,
    paused,
    recess: status === "recess",
    deliberating: upcoming?.type === "verdict" && debate.fetching,
  };

  const restart = () => {
    stopSpeaking();
    setIntroDone(false);
    debate.restart();
  };

  // ── Judgment view ─────────────────────────────────────────────
  if (verdict) {
    return (
      <EvidenceContext.Provider value={debate.evidence}>
      <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <Judgment verdict={verdict} topic={topic} mode={mode} />
        <div className="mt-10 space-y-3">
          <EvidenceBadge kind={debate.evidenceKind} count={debate.evidence.length} researching={false} />
          <ExhibitsPanel facts={debate.evidence} kind={debate.evidenceKind} open={false} />
        </div>
        <AskTheJudge
          topic={topic}
          caseId={caseId}
          evidence={caseId ? undefined : debate.evidence}
          turns={debate.turns}
          scores={debate.scores}
          verdict={verdict}
        />
        <details className="group mt-16 rounded-xl border border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.02]">
            <span className="label">Full record · {entries.length + 1} entries</span>
            <span className="text-sm text-muted group-open:hidden">Show +</span>
            <span className="hidden text-sm text-muted group-open:inline">Hide −</span>
          </summary>
          <div className="space-y-2 border-t border-line p-2 sm:p-4">
            <StaticEntry entry={intro} />
            {entries.map((e) => (
              <StaticEntry key={e.id} entry={e} />
            ))}
          </div>
        </details>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/file">File a new case</ButtonLink>
          <button onClick={restart} className={buttonClass("secondary")}>
            Re-hear this case
          </button>
        </div>
      </div>
      </EvidenceContext.Provider>
    );
  }

  // ── Hearing view ──────────────────────────────────────────────
  return (
    <EvidenceContext.Provider value={debate.evidence}>
    <div className="pb-10">
      <ObjectionBand by={objection?.by ?? null} type={objection?.type} />

      {/* Case caption */}
      <div className="relative overflow-hidden border-b border-line">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-10 sm:px-8 sm:pt-14">
          <p className="label flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-accent">
              <span className="h-1.5 w-1.5 animate-pulse bg-accent" /> In session
            </span>
            · {mode === "full" ? "Full hearing" : "Quick hearing"}
            {caseId ? " · From the case library" : debate.evidenceKind === "web" ? " · Web-researched evidence" : debate.researching ? "" : " · Not fact-checked"}
          </p>
          <h1 className="display mt-5 max-w-5xl text-4xl sm:text-6xl lg:text-7xl">{topic}</h1>
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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
      </div>

      {/* Sticky bench bar: credibility meter + parties */}
      <div className="sticky top-14 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-3 px-5 py-3 sm:px-8">
          <CredibilityScale scores={shownScores} />
          <Roster
            status={{ prosecutor: partyStatus("prosecutor"), judge: partyStatus("judge"), defender: partyStatus("defender") }}
            emotions={emotions}
          />
        </div>
      </div>

      {/* The record */}
      <motion.div
        animate={shake}
        className="mx-auto grid max-w-7xl gap-6 px-3 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start"
      >
        {/* The pixel courtroom reacts to the live debate state; it stays in view on desktop. */}
        <div className="lg:sticky lg:top-[11rem]">
          <CourtScene state={scene} />
        </div>

        <div className="min-w-0">
        {/* Evidence on file: where the facts come from, and the exhibits with their sources */}
        <div className="mb-5 space-y-3 px-1">
          <EvidenceBadge kind={debate.evidenceKind} count={debate.evidence.length} researching={debate.researching} />
          <ExhibitsPanel key={String(exhibitsOpen)} facts={debate.evidence} kind={debate.evidenceKind} open={exhibitsOpen} />
        </div>
        <div className="flex items-center justify-between px-2 pb-3">
          <p className="label">The record</p>
          {pastEntries.length > 0 && introDone && (
            <button onClick={() => setFullRecord((f) => !f)} className="label transition-colors hover:text-ink">
              {fullRecord ? "Show current only" : `Show full record (${pastEntries.length + 1})`}
            </button>
          )}
        </div>

        <div className="space-y-2">
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
        </div>
        {paused && (
          <p className="mt-4 rounded-lg border border-accent/40 bg-accent/[0.06] px-4 py-3 text-sm text-accent">
            Court adjourned — press Resume to continue.
          </p>
        )}
        </div>
      </motion.div>
    </div>
    </EvidenceContext.Provider>
  );
}
