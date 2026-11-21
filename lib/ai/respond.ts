// Small helpers shared by the API routes: turn any error into a safe,
// themed JSON response (never a stack trace or raw provider error), and
// guard every request (rate limit → size → JSON → schema → case checks).
import "server-only";
import type { z } from "zod";
import { CourtError } from "./provider";
import { getCase } from "@/lib/cases";
import { validateCase } from "@/lib/validation";
import { clientIp, rateLimit, type Bucket } from "@/lib/security/rateLimit";
import type { CaseFact } from "@/lib/types";

/** Largest request body we accept. A Full debate's transcript + verdict is well under 30 KB. */
export const MAX_BODY_BYTES = 64 * 1024;

export function errorResponse(error: unknown): Response {
  if (error instanceof CourtError && error.code === "missing_keys") {
    return Response.json({ error: "missing_keys" }, { status: 503 });
  }
  // Details go to the server log only; the browser just gets a themed code.
  if (!(error instanceof CourtError)) console.error("[api] unexpected error:", error);
  return Response.json({ error: "recess" }, { status: 503 });
}

const invalid = (status = 400, message?: string) => ({ response: Response.json({ error: "invalid_input", ...(message ? { message } : {}) }, { status }) });

/**
 * SECURITY: every API route reads its body through here.
 * 1. Rate limit per IP (429 → the UI shows "The court is in recess").
 * 2. Only JSON, and at most MAX_BODY_BYTES.
 * 3. The zod schema (types, lengths, ranges; unknown fields are dropped).
 * 4. The case text check (length, gibberish, injection attempts, offensive topics).
 */
export async function readBody<S extends z.ZodTypeAny>(
  request: Request,
  schema: S,
  bucket: Bucket,
): Promise<{ data: z.output<S> } | { response: Response }> {
  const limit = rateLimit(clientIp(request), bucket);
  if (!limit.ok) {
    return { response: Response.json({ error: "recess" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }) };
  }

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return invalid(415);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return invalid(413);
  const text = await request.text().catch(() => "");
  if (text.length > MAX_BODY_BYTES) return invalid(413); // content-length can be missing or wrong

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return invalid();
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return invalid();

  const topicCheck = validateCase((parsed.data as { topic: string }).topic);
  if (!topicCheck.ok) return invalid(400, topicCheck.message);
  return { data: { ...(parsed.data as object), topic: topicCheck.topic } as z.output<S> };
}

/** Case Library facts to use as evidence. Placeholder facts are skipped so lawyers never cite them. */
export function evidenceFor(caseId: string | undefined): CaseFact[] {
  return (getCase(caseId)?.facts ?? []).filter((f) => !/placeholder/i.test(`${f.fact} ${f.source}`));
}
