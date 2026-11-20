// The order of events in a debate. The debate loop (useDebate.ts) walks through
// this list one step at a time.

import type { DebateMode, Phase, Side, TurnKind } from "@/lib/types";

export type TurnStep = { type: "turn"; phase: Phase; speaker: Side; kind: TurnKind };
export type JudgeStep = { type: "judge"; phase: Phase };
export type VerdictStep = { type: "verdict" };
export type Step = TurnStep | JudgeStep | VerdictStep;

export const PHASE_LABEL: Record<Phase, string> = {
  opening: "Opening",
  rebuttal: "Rebuttal",
  cross: "Cross-examination",
  closing: "Closing",
};

/** Both lawyers speak, then the Judge scores the round in one call. */
function round(phase: Phase): Step[] {
  return [
    { type: "turn", phase, speaker: "prosecutor", kind: "statement" },
    { type: "turn", phase, speaker: "defender", kind: "statement" },
    { type: "judge", phase },
  ];
}

/** Cross-examination: each side asks one question and the other answers it. */
const CROSS: Step[] = [
  { type: "turn", phase: "cross", speaker: "prosecutor", kind: "question" },
  { type: "turn", phase: "cross", speaker: "defender", kind: "answer" },
  { type: "turn", phase: "cross", speaker: "defender", kind: "question" },
  { type: "turn", phase: "cross", speaker: "prosecutor", kind: "answer" },
  { type: "judge", phase: "cross" },
];

/** Quick: Opening → Rebuttal → Verdict (7 AI calls). Full adds Cross-exam and Closing (15 calls). */
export function buildPlan(mode: DebateMode): Step[] {
  const steps = [...round("opening"), ...round("rebuttal")];
  if (mode === "full") steps.push(...CROSS, ...round("closing"));
  steps.push({ type: "verdict" });
  return steps;
}

export function phasesFor(mode: DebateMode): Phase[] {
  return mode === "full" ? ["opening", "rebuttal", "cross", "closing"] : ["opening", "rebuttal"];
}
