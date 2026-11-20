// Zod schemas that check the AI's JSON replies before the UI uses them.
// Models sometimes return numbers as strings or slightly odd values, so we
// coerce and clamp instead of rejecting small mistakes.

import { z } from "zod";
import { EMOTIONS, type Emotion } from "@/lib/types";

const score = (max: number) => z.coerce.number().transform((n) => Math.max(0, Math.min(max, Math.round(n))));
const side = z.enum(["prosecutor", "defender"]);
const strList = z.array(z.string()).catch([]).transform((a) => a.slice(0, 4));

/** Lawyer turn: { text, emotion } */
export const turnSchema = z.object({
  text: z.string().min(1),
  emotion: z
    .string()
    .transform((e) => e.toLowerCase().trim())
    .transform((e): Emotion => ((EMOTIONS as string[]).includes(e) ? (e as Emotion) : "neutral"))
    .catch("neutral"),
});

/** Judge round score: { prosecutorScore, defenderScore, fallacy } */
export const roundScoreSchema = z.object({
  prosecutorScore: score(10),
  defenderScore: score(10),
  fallacy: z
    .object({ by: side, type: z.string().min(1), quote: z.string().min(1) })
    .nullable()
    .catch(null)
    .default(null),
});

const pair = z.object({ prosecutor: score(10), defender: score(10) });

/** Final verdict. */
export const verdictSchema = z.object({
  winner: z.enum(["prosecutor", "defender", "draw"]),
  reason: z.string().catch(""),
  prosecutorScore: score(100),
  defenderScore: score(100),
  categories: z.object({ reasoning: pair, evidence: pair, rebuttal: pair, logic: pair }),
  strengths: z.object({ prosecutor: strList, defender: strList }),
  weaknesses: z.object({ prosecutor: strList, defender: strList }),
  summary: z.string().min(1),
  takeaways: z.array(z.string()).min(1).transform((a) => a.slice(0, 5)),
});

// ---- Request bodies sent by the browser to our API routes ----

const phase = z.enum(["opening", "rebuttal", "cross", "closing"]);
export const turnInput = z.object({
  speaker: side,
  phase,
  kind: z.enum(["statement", "question", "answer"]),
  text: z.string().max(2000),
});
const transcript = z.array(turnInput).max(24);
const scoreInput = z.object({
  phase,
  prosecutorScore: z.number(),
  defenderScore: z.number(),
  fallacy: z.object({ by: side, type: z.string(), quote: z.string() }).nullable(),
});

export const debateContext = z.object({
  topic: z.string(),
  caseId: z.string().max(80).optional(),
  transcript,
});

export const turnRequest = debateContext.extend({
  step: z.object({ speaker: side, phase, kind: z.enum(["statement", "question", "answer"]) }),
});
export const judgeRequest = debateContext.extend({ phase });
export const verdictRequest = debateContext.extend({ scores: z.array(scoreInput).max(8) });
export const chatRequest = verdictRequest.extend({
  verdict: z.record(z.string(), z.unknown()),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .min(1)
    .max(30),
});
