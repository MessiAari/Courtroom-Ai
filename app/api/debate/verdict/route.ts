// POST /api/debate/verdict — the Judge's final verdict.
// Browser → this route → Gemini (fallback: Groq) → Verdict JSON
import { judgeVerdict } from "@/lib/ai/agents";
import { errorResponse, evidenceFor, readBody } from "@/lib/ai/respond";
import { verdictRequest } from "@/lib/ai/schemas";
import { compactScores, compactTranscript } from "@/lib/debate/transcript";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await readBody(request, verdictRequest, "debate");
  if ("response" in body) return body.response;
  const { topic, caseId, evidence, transcript, scores } = body.data;
  if (transcript.length < 2) return Response.json({ error: "invalid_input" }, { status: 400 });

  try {
    const verdict = await judgeVerdict({
      topic,
      transcript: compactTranscript(transcript),
      evidence: evidenceFor(caseId, evidence),
      scoresText: compactScores(scores),
      scores,
    });
    return Response.json(verdict);
  } catch (error) {
    return errorResponse(error);
  }
}
