// POST /api/debate/turn — one lawyer turn (Prosecutor or Defender).
// Browser → this route → Groq (fallback: Mistral) → { text, emotion, provider }
import { lawyerTurn } from "@/lib/ai/agents";
import { errorResponse, evidenceFor, readBody } from "@/lib/ai/respond";
import { turnRequest } from "@/lib/ai/schemas";
import { compactTranscript } from "@/lib/debate/transcript";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await readBody(request, turnRequest, "debate");
  if ("response" in body) return body.response;
  const { topic, caseId, evidence, transcript, step } = body.data;

  try {
    // The FULL transcript so far is sent, so the lawyer answers the opponent's real points.
    const turn = await lawyerTurn({
      side: step.speaker,
      topic,
      evidence: evidenceFor(caseId, evidence),
      transcript: compactTranscript(transcript),
      phase: step.phase,
      kind: step.kind,
    });
    return Response.json(turn);
  } catch (error) {
    return errorResponse(error);
  }
}
