// POST /api/debate/research — the clerk gathers web evidence for a typed-in case.
// Browser → this route → Gemini + Google Search → { evidence: [{ side, fact, source, sourceTitle }] }
// An empty list means nothing could be verified; the hearing then runs "not fact-checked".
import { readBody } from "@/lib/ai/respond";
import { researchCase } from "@/lib/ai/research";
import { researchRequest } from "@/lib/ai/schemas";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await readBody(request, researchRequest, "debate");
  if ("response" in body) return body.response;
  const evidence = await researchCase(body.data.topic);
  return Response.json({ evidence });
}
