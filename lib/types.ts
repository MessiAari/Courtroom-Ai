// Shared types used by both the browser (UI) and the server (API routes).

export type Side = "prosecutor" | "defender";
export type Speaker = Side | "judge";
export type Emotion = "neutral" | "confident" | "angry" | "smug" | "shocked";
export const EMOTIONS: Emotion[] = ["neutral", "confident", "angry", "smug", "shocked"];

export type DebateMode = "quick" | "full";
export type Phase = "opening" | "rebuttal" | "cross" | "closing";
/** A normal argument, a cross-examination question, or the answer to one. */
export type TurnKind = "statement" | "question" | "answer";

/** One lawyer turn in the debate. */
export interface Turn {
  speaker: Side;
  phase: Phase;
  kind: TurnKind;
  text: string;
  emotion: Emotion;
  provider?: string; // which AI actually answered (e.g. "Groq" or "Mistral (fallback)")
}

export interface Fallacy {
  by: Side;
  type: string;
  quote: string;
}

/** The Judge's score for one round. */
export interface RoundScore {
  phase: Phase;
  prosecutorScore: number; // 0-10
  defenderScore: number; // 0-10
  fallacy: Fallacy | null;
  provider?: string;
}

export interface SidePair<T> {
  prosecutor: T;
  defender: T;
}

/** The final verdict returned by the Judge. */
export interface Verdict {
  winner: Side | "draw";
  reason: string;
  prosecutorScore: number; // 0-100
  defenderScore: number; // 0-100
  categories: {
    reasoning: SidePair<number>; // 0-10 each
    evidence: SidePair<number>;
    rebuttal: SidePair<number>;
    logic: SidePair<number>;
  };
  strengths: SidePair<string[]>;
  weaknesses: SidePair<string[]>;
  summary: string;
  takeaways: string[];
  provider?: string;
}

export interface CaseFact {
  fact: string;
  source: string;
  side?: "for" | "against"; // which side the fact mainly supports (from our Perplexity research)
  sourceTitle?: string; // site name, for facts found by the web-research step
}

/** Where a hearing's evidence came from. */
export type EvidenceKind = "library" | "web" | "none";

export interface CaseFile {
  id: string;
  title: string;
  description: string;
  facts: CaseFact[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Error codes the API routes send back. The UI turns these into themed messages. */
export type CourtErrorCode = "recess" | "missing_keys" | "invalid_input";
