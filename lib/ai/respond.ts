// Small helpers shared by the API routes: turn any error into a safe,
// themed JSON response (never a stack trace or raw provider error).
import "server-only";
import type { z } from "zod";
import { CourtError } from "./provider";
import { getCase } from "@/lib/cases";
import { validateCase } from "@/lib/validation";
import type { CaseFact } from "@/lib/types";

export function errorResponse(error: unknown): Response {
  if (error instanceof CourtError && error.code === "missing_keys") {
    return Response.json({ error: "missing_keys" }, { status: 503 });
  }
  if (!(error instanceof CourtError)) console.error("[api] unexpected error:", error);
  return Response.json({ error: "recess" }, { status: 503 });
}

/** Reads + validates the JSON body. Returns either the data or a 400 response. */
export async function readBody<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
): Promise<{ data: z.output<S> } | { response: Response }> {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return { response: Response.json({ error: "invalid_input" }, { status: 400 }) };
  const topicCheck = validateCase((parsed.data as { topic: string }).topic);
  if (!topicCheck.ok) {
    return { response: Response.json({ error: "invalid_input", message: topicCheck.message }, { status: 400 }) };
  }
  return { data: { ...(parsed.data as object), topic: topicCheck.topic } as z.output<S> };
}

/** Case Library facts to use as evidence. Placeholder facts are skipped so lawyers never cite them. */
export function evidenceFor(caseId: string | undefined): CaseFact[] {
  return (getCase(caseId)?.facts ?? []).filter((f) => !/placeholder/i.test(`${f.fact} ${f.source}`));
}
