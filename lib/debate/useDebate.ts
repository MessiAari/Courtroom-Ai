"use client";
// ─────────────────────────────────────────────────────────────────────────────
// THE DEBATE LOOP
// The browser drives the debate one step at a time:
//   1. Take the next step from the plan (lawyer turn, judge score, or verdict).
//   2. POST it to our API route with the FULL transcript so far.
//   3. Store the result; the courtroom scene "plays" it (typewriter + voice).
//   4. When the scene finishes showing a result, the loop continues.
// To keep things snappy we fetch at most ONE step ahead of what is on screen.
// Because every result is stored as it arrives, an API failure never loses
// anything: we just pause in "recess" and the user can retry the same step.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { CaseFact, CourtErrorCode, DebateMode, EvidenceKind, RoundScore, Turn, Verdict } from "@/lib/types";
import { buildPlan, type JudgeStep, type Step, type TurnStep } from "./rounds";

export type StepResult =
  | { kind: "turn"; step: TurnStep; turn: Turn }
  | { kind: "score"; step: JudgeStep; score: RoundScore }
  | { kind: "verdict"; verdict: Verdict };

export type DebateStatus = "running" | "paused" | "recess" | "done";

interface State {
  runId: number; // bumps on restart so late replies from an old run are ignored
  status: DebateStatus;
  results: StepResult[];
  shown: number; // how many results the scene has finished showing
  fetching: boolean;
  skip: boolean; // "skip to verdict" pressed
  error: CourtErrorCode | null;
}

type Action =
  | { type: "fetch_start" }
  | { type: "fetch_ok"; runId: number; result: StepResult }
  | { type: "fetch_fail"; runId: number; code: CourtErrorCode }
  | { type: "shown" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "skip" }
  | { type: "retry" }
  | { type: "restart" };

const initial: State = { runId: 0, status: "running", results: [], shown: 0, fetching: false, skip: false, error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetch_start":
      return { ...state, fetching: true };
    case "fetch_ok": {
      if (action.runId !== state.runId) return state; // stale reply from before a restart
      const results = [...state.results, action.result];
      const isVerdict = action.result.kind === "verdict";
      return {
        ...state,
        results,
        fetching: false,
        // After "skip", anything that was still in flight is marked as already shown.
        shown: state.skip && !isVerdict ? results.length : state.shown,
        status: isVerdict ? "done" : state.status,
      };
    }
    case "fetch_fail":
      if (action.runId !== state.runId) return state;
      return { ...state, fetching: false, status: "recess", error: action.code };
    case "shown":
      return { ...state, shown: Math.min(state.shown + 1, state.results.length) };
    case "pause":
      return state.status === "running" ? { ...state, status: "paused" } : state;
    case "resume":
      return state.status === "paused" ? { ...state, status: "running" } : state;
    case "skip":
      return { ...state, skip: true, shown: state.results.length };
    case "retry":
      return { ...state, status: "running", error: null };
    case "restart":
      return { ...initial, runId: state.runId + 1 };
  }
}

/** Which step should be fetched next (null = debate finished). */
function nextStep(plan: Step[], state: State): Step | null {
  if (state.results.some((r) => r.kind === "verdict")) return null;
  if (state.skip) return { type: "verdict" };
  return plan[state.results.length] ?? null;
}

/** Error thrown by callApi with our themed error code. */
class ApiError extends Error {
  constructor(public code: CourtErrorCode) {
    super(code);
  }
}

/** POSTs JSON to one of our API routes. Network errors and timeouts become "recess". */
async function callApi<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });
  } catch {
    throw new ApiError("recess");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data.error as CourtErrorCode) ?? "recess");
  return data as T;
}

export interface DebateConfig {
  topic: string;
  mode: DebateMode;
  caseId?: string;
  /** Case Library facts (for showing exhibits; the server loads its own copy). */
  libraryEvidence?: CaseFact[];
}

export function useDebate({ topic, mode, caseId, libraryEvidence }: DebateConfig) {
  const [state, dispatch] = useReducer(reducer, initial);

  // EVIDENCE: library cases already have researched facts. For a typed-in topic the
  // clerk researches the web first (while the Judge's opening line plays); the lawyers
  // wait for it, then every step sends the evidence along so they can cite [E1]–[E6].
  const [webEvidence, setWebEvidence] = useState<CaseFact[] | null>(null); // null = still researching
  const researchStarted = useRef(false);
  useEffect(() => {
    if (caseId || researchStarted.current) return;
    researchStarted.current = true;
    callApi<{ evidence: CaseFact[] }>("/api/debate/research", { topic })
      .then((r) => setWebEvidence(Array.isArray(r.evidence) ? r.evidence : []))
      .catch(() => setWebEvidence([])); // research failed → hearing runs "not fact-checked"
  }, [caseId, topic]);
  const researching = !caseId && webEvidence === null;
  const evidence = useMemo(() => (caseId ? (libraryEvidence ?? []) : (webEvidence ?? [])), [caseId, libraryEvidence, webEvidence]);
  const evidenceKind: EvidenceKind = caseId ? "library" : evidence.length ? "web" : "none";
  const plan = useMemo(() => buildPlan(mode), [mode]);
  // Guards against starting the same request twice (React Strict Mode runs effects twice in dev).
  const inFlight = useRef<string | null>(null);

  // Everything fetched so far, split by type.
  const turns = useMemo(() => state.results.flatMap((r) => (r.kind === "turn" ? [r.turn] : [])), [state.results]);
  const scores = useMemo(() => state.results.flatMap((r) => (r.kind === "score" ? [r.score] : [])), [state.results]);
  const verdict = state.results.find((r) => r.kind === "verdict")?.verdict ?? null;

  /** Runs one step against the right API route. */
  const runStep = useCallback(
    async (step: Step): Promise<StepResult> => {
      const base = {
        topic,
        caseId,
        ...(caseId || !evidence.length ? {} : { evidence }),
        transcript: turns.map(({ speaker, phase, kind, text }) => ({ speaker, phase, kind, text })),
      };
      if (step.type === "turn") {
        const reply = await callApi<{ text: string; emotion: Turn["emotion"]; provider: string }>("/api/debate/turn", {
          ...base,
          step: { speaker: step.speaker, phase: step.phase, kind: step.kind },
        });
        return { kind: "turn", step, turn: { speaker: step.speaker, phase: step.phase, kind: step.kind, ...reply } };
      }
      if (step.type === "judge") {
        const score = await callApi<RoundScore>("/api/debate/judge", { ...base, phase: step.phase });
        return { kind: "score", step, score: { ...score, phase: step.phase } };
      }
      const v = await callApi<Verdict>("/api/debate/verdict", { ...base, scores });
      return { kind: "verdict", verdict: v };
    },
    [topic, caseId, evidence, turns, scores],
  );

  // The loop itself: whenever we're running, idle, and not too far ahead of the
  // screen, fetch the next step.
  useEffect(() => {
    if (state.status !== "running" || state.fetching || researching) return;
    if (state.results.length - state.shown >= 2) return; // wait for the scene to catch up
    const step = nextStep(plan, state);
    if (!step) return;

    const runId = state.runId;
    const key = `${runId}:${state.results.length}:${step.type}`;
    if (inFlight.current === key) return;
    inFlight.current = key;
    dispatch({ type: "fetch_start" });
    runStep(step)
      .then((result) => dispatch({ type: "fetch_ok", runId, result }))
      .catch((e) => {
        inFlight.current = null; // allow "retry" to fire the same step again
        dispatch({ type: "fetch_fail", runId, code: e instanceof ApiError ? e.code : "recess" });
      });
  }, [plan, state, runStep, researching]);

  const current = state.shown < state.results.length ? state.results[state.shown] : null;
  const shownTurns = state.results.slice(0, state.shown + (current ? 1 : 0));

  return {
    plan,
    evidence,
    evidenceKind,
    researching,
    status: state.status,
    error: state.error,
    fetching: state.fetching,
    upcoming: nextStep(plan, state),
    results: state.results,
    turns,
    scores,
    verdict,
    /** The result the scene should be showing right now. */
    current,
    /** Results that are on screen (shown or showing) — drives the meter and transcript. */
    visible: shownTurns,
    canSkip: turns.length >= 2 && !state.skip && !verdict,
    skipping: state.skip,
    markShown: useCallback(() => dispatch({ type: "shown" }), []),
    pause: useCallback(() => dispatch({ type: "pause" }), []),
    resume: useCallback(() => dispatch({ type: "resume" }), []),
    skip: useCallback(() => dispatch({ type: "skip" }), []),
    retry: useCallback(() => dispatch({ type: "retry" }), []),
    restart: useCallback(() => dispatch({ type: "restart" }), []),
  };
}
