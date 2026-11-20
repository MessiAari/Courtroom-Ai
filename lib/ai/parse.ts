// Safe JSON handling for AI replies, plus the "retry once" rule.

import type { z } from "zod";
import { generateWithFallback, type GenerateOptions, type Provider } from "./provider";

/** Pulls the first {...} object out of a reply (models sometimes wrap JSON in ``` fences or add text). */
export function extractJson(text: string): unknown {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * Asks for JSON, validates it with a zod schema, and retries ONCE with a
 * reminder if the reply was broken. Returns data = null if both tries fail,
 * so the caller can fall back to plain text instead of crashing.
 */
export async function generateStructured<S extends z.ZodTypeAny>(
  providers: Provider[],
  options: GenerateOptions,
  schema: S,
): Promise<{ data: z.output<S> | null; raw: string; provider: string }> {
  const first = await generateWithFallback(providers, { ...options, json: true });
  const parsed = schema.safeParse(extractJson(first.text));
  if (parsed.success) return { data: parsed.data, raw: first.text, provider: first.provider };

  const retry = await generateWithFallback(providers, {
    ...options,
    json: true,
    messages: [
      ...options.messages,
      { role: "assistant", content: first.text },
      { role: "user", content: "That reply was not valid JSON in the required format. Reply again with ONLY the JSON object." },
    ],
  });
  const reparsed = schema.safeParse(extractJson(retry.text));
  return { data: reparsed.success ? reparsed.data : null, raw: retry.text, provider: retry.provider };
}

/** Turns a broken JSON reply into readable plain text (the last-resort fallback). */
export function toPlainText(raw: string): string {
  const textField = raw.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (textField) return textField[1].replace(/\\n/g, " ").replace(/\\"/g, '"');
  return raw.replace(/```(?:json)?/gi, "").replace(/[{}[\]"]/g, "").replace(/\s+/g, " ").trim();
}

/** Keeps a turn under the word limit, cutting at the last full sentence if possible. */
export function limitWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  const cut = words.slice(0, maxWords).join(" ");
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return lastStop > cut.length * 0.5 ? cut.slice(0, lastStop + 1) : `${cut}…`;
}
