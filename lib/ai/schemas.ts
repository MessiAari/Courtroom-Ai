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
// SECURITY: these are the server's gatekeepers. Every string has a length cap,
// every number a range, arrays a maximum size, and unknown fields are dropped
// (zod objects strip extra keys), so a forged request can't smuggle extra
// text into the AI prompts.

const phase = z.enum(["opening", "rebuttal", "cross", "closing"]);
const kind = z.enum(["statement", "question", "answer"]);
const roundScore = z.number().int().min(0).max(10);
const shortText = (max: number) => z.string().max(max);

export const turnInput = z.object({
  speaker: side,
  phase,
  kind,
  text: shortText(1200), // turns are under 100 words (~700 characters)
});
const transcript = z.array(turnInput).max(24);
const scoreInput = z.object({
  phase,
  prosecutorScore: roundScore,
  defenderScore: roundScore,
  fallacy: z.object({ by: side, type: shortText(60), quote: shortText(400) }).nullable(),
});

// Web-researched evidence for typed-in topics (Case Library evidence is loaded on the server instead).
export const evidenceInput = z
  .array(
    z.object({
      side: z.enum(["for", "against"]).optional(),
      fact: shortText(300),
      source: z.string().max(1000).url().refine((u) => /^https?:\/\//.test(u), "web links only"),
      sourceTitle: shortText(120).optional(),
    }),
  )
  .max(8);

export const debateContext = z.object({
  topic: shortText(400), // the case rules (10–300 characters) are checked after this
  caseId: z.string().max(80).regex(/^[a-z0-9-]*$/).optional(),
  evidence: evidenceInput.optional(),
  transcript,
});

export const researchRequest = z.object({ topic: shortText(400) });

export const turnRequest = debateContext.extend({
  step: z.object({ speaker: side, phase, kind }),
});
export const judgeRequest = debateContext.extend({ phase });
export const verdictRequest = debateContext.extend({ scores: z.array(scoreInput).max(8) });

// The verdict the browser sends back for Ask the Judge must have exactly this shape.
const pairIn = z.object({ prosecutor: roundScore, defender: roundScore });
const pointsIn = z.array(shortText(300)).max(5);
const verdictInput = z.object({
  winner: z.enum(["prosecutor", "defender", "draw"]),
  reason: shortText(500),
  prosecutorScore: z.number().int().min(0).max(100),
  defenderScore: z.number().int().min(0).max(100),
  categories: z.object({ reasoning: pairIn, evidence: pairIn, rebuttal: pairIn, logic: pairIn }),
  strengths: z.object({ prosecutor: pointsIn, defender: pointsIn }),
  weaknesses: z.object({ prosecutor: pointsIn, defender: pointsIn }),
  summary: shortText(1000),
  takeaways: z.array(shortText(300)).max(5),
});

export const chatRequest = verdictRequest.extend({
  verdict: verdictInput,
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({ role: z.literal("user"), content: shortText(500) }),
        // earlier Judge replies are trimmed rather than rejected
        z.object({ role: z.literal("assistant"), content: z.string().max(4000).transform((c) => c.slice(0, 1500)) }),
      ]),
    )
    .min(1)
    .max(30),
});
