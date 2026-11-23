// POST /api/debate/judge — the Judge scores one whole round in ONE call (saves tokens).
// Browser → this route → Gemini (fallback: Groq) → { prosecutorScore, defenderScore, fallacy }
import { judgeRound } from "@/lib/ai/agents";
import { errorResponse, evidenceFor, readBody } from "@/lib/ai/respond";
import { judgeRequest } from "@/lib/ai/schemas";
import { compactTranscript } from "@/lib/debate/transcript";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await readBody(request, judgeRequest, "debate");
  if ("response" in body) return body.response;
  const { topic, caseId, evidence, transcript, phase } = body.data;

  // Each side's text in this round, used to verify any fallacy quote.
  const inRound = transcript.filter((t) => t.phase === phase);
  const sideTexts = {
    prosecutor: inRound.filter((t) => t.speaker === "prosecutor").map((t) => t.text).join(" "),
    defender: inRound.filter((t) => t.speaker === "defender").map((t) => t.text).join(" "),
  };

  try {
    const score = await judgeRound({ topic, transcript: compactTranscript(transcript), evidence: evidenceFor(caseId, evidence), phase, sideTexts });
    return Response.json(score);
  } catch (error) {
    return errorResponse(error);
  }
}
