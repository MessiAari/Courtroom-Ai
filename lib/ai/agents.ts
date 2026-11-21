// The three AI characters. Each function = one API call (plus fallback/retry).
// SERVER ONLY.
import "server-only";

import type { CaseFact, Phase, RoundScore, Side, TurnKind, Verdict } from "@/lib/types";
import { gemini } from "./gemini";
import { groq } from "./groq";
import { mistral } from "./mistral";
import { generateStructured, limitWords, toPlainText } from "./parse";
import { generateWithFallback, type Provider } from "./provider";
import {
  JUDGE_ROUND_SYSTEM,
  JUDGE_VERDICT_SYSTEM,
  MAX_TURN_WORDS,
  dataBlock,
  judgeChatSystemPrompt,
  judgeRoundUserPrompt,
  lawyerSystemPrompt,
  lawyerUserPrompt,
  verdictUserPrompt,
} from "./prompts";
import { roundScoreSchema, turnSchema, verdictSchema } from "./schemas";

// Provider chains: first = main provider, second = fallback.
const LAWYER_CHAIN: Provider[] = [groq, mistral]; // both lawyers use the SAME chain/model
const JUDGE_CHAIN: Provider[] = [gemini, groq];

/** One lawyer turn → { text, emotion }. Falls back to plain text + neutral if JSON fails twice. */
export async function lawyerTurn(p: {
  side: Side;
  topic: string;
  evidence?: CaseFact[];
  transcript: string;
  phase: Phase;
  kind: TurnKind;
}) {
  const { data, raw, provider } = await generateStructured(
    LAWYER_CHAIN,
    {
      system: lawyerSystemPrompt(p.side, Boolean(p.evidence?.length)),
      messages: [{ role: "user", content: lawyerUserPrompt(p) }],
      maxTokens: 400,
      temperature: 0.8,
    },
    turnSchema,
  );
  const text = data?.text ?? toPlainText(raw);
  return { text: limitWords(text, MAX_TURN_WORDS), emotion: data?.emotion ?? "neutral", provider };
}

/** Normalises text so we can check the Judge's "quote" really appears in the transcript. */
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

/** Judge scores one whole round in a single call. */
export async function judgeRound(p: {
  topic: string;
  transcript: string;
  phase: Phase;
  sideTexts: Record<Side, string>;
}): Promise<RoundScore> {
  const { data, provider } = await generateStructured(
    JUDGE_CHAIN,
    {
      system: JUDGE_ROUND_SYSTEM,
      messages: [{ role: "user", content: judgeRoundUserPrompt(p.topic, p.transcript, p.phase) }],
      maxTokens: 300,
      temperature: 0.2,
    },
    roundScoreSchema,
  );
  if (!data) return { phase: p.phase, prosecutorScore: 5, defenderScore: 5, fallacy: null, provider };

  // Only show an OBJECTION if the quoted words really appear in that side's text
  // (protects against the model "hallucinating" a quote).
  let fallacy = data.fallacy;
  if (fallacy) {
    const quote = normalise(fallacy.quote).slice(0, 40);
    if (!quote || !normalise(p.sideTexts[fallacy.by]).includes(quote)) fallacy = null;
  }
  return { phase: p.phase, prosecutorScore: data.prosecutorScore, defenderScore: data.defenderScore, fallacy, provider };
}

/** Final verdict. If the JSON fails twice, builds a basic verdict from the round scores. */
export async function judgeVerdict(p: {
  topic: string;
  transcript: string;
  scoresText: string;
  scores: RoundScore[];
}): Promise<Verdict> {
  const { data, raw, provider } = await generateStructured(
    JUDGE_CHAIN,
    {
      system: JUDGE_VERDICT_SYSTEM,
      messages: [{ role: "user", content: verdictUserPrompt(p.topic, p.transcript, p.scoresText) }],
      maxTokens: 1200,
      temperature: 0.3,
    },
    verdictSchema,
  );
  if (data) return { ...data, provider };

  const total = (side: Side) => p.scores.reduce((sum, s) => sum + (side === "prosecutor" ? s.prosecutorScore : s.defenderScore), 0);
  const max = Math.max(1, p.scores.length * 10);
  const ps = Math.round((total("prosecutor") / max) * 100);
  const ds = Math.round((total("defender") / max) * 100);
  const even = { prosecutor: 5, defender: 5 };
  return {
    winner: ps === ds ? "draw" : ps > ds ? "prosecutor" : "defender",
    reason: "Decided on the round-by-round scores.",
    prosecutorScore: ps,
    defenderScore: ds,
    categories: { reasoning: even, evidence: even, rebuttal: even, logic: even },
    strengths: { prosecutor: [], defender: [] },
    weaknesses: { prosecutor: [], defender: [] },
    summary: toPlainText(raw).slice(0, 600),
    takeaways: [],
    provider,
  };
}

/** "Ask the Judge" chatbot reply (plain text). */
export async function judgeChat(p: {
  topic: string;
  transcript: string;
  scoresText: string;
  verdictJson: string;
  messages: { role: "user" | "assistant"; content: string }[];
}) {
  return generateWithFallback(JUDGE_CHAIN, {
    system: judgeChatSystemPrompt({ topic: p.topic, transcript: p.transcript, scores: p.scoresText, verdict: p.verdictJson }),
    // SECURITY: the student's text is wrapped as data, so "ignore your rules…" is read as a question, not an order.
    messages: p.messages.map((m) => (m.role === "user" ? { role: "user" as const, content: dataBlock("question", m.content) } : m)),
    maxTokens: 700,
    temperature: 0.5,
  });
}
