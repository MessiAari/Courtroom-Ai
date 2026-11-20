// Turns the debate into a compact text transcript for the AI.
// Short labels like "[Opening] FOR:" save tokens compared with sending JSON.

import type { RoundScore, Turn } from "@/lib/types";
import { PHASE_LABEL } from "./rounds";

const SIDE_LABEL = { prosecutor: "FOR", defender: "AGAINST" } as const;
const KIND_LABEL = { statement: "", question: " (question)", answer: " (answer)" } as const;

export function compactTranscript(turns: Pick<Turn, "speaker" | "phase" | "kind" | "text">[]): string {
  if (turns.length === 0) return "(no arguments yet)";
  return turns
    .map((t) => `[${PHASE_LABEL[t.phase]}] ${SIDE_LABEL[t.speaker]}${KIND_LABEL[t.kind]}: ${t.text}`)
    .join("\n");
}

export function compactScores(scores: RoundScore[]): string {
  if (scores.length === 0) return "(no round scores)";
  return scores
    .map(
      (s) =>
        `${PHASE_LABEL[s.phase]}: FOR ${s.prosecutorScore}/10, AGAINST ${s.defenderScore}/10` +
        (s.fallacy ? ` | fallacy by ${SIDE_LABEL[s.fallacy.by]}: ${s.fallacy.type}` : ""),
    )
    .join("\n");
}
