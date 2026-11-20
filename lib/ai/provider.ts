// Provider abstraction: every AI provider (Groq, Mistral, Gemini) looks the same
// to the rest of the app, so they can be swapped or chained as fallbacks.
// SERVER ONLY — these files read API keys from process.env.

import type { ChatMessage } from "@/lib/types";

export interface GenerateOptions {
  system: string;
  messages: ChatMessage[];
  json?: boolean; // ask the provider for a JSON-only reply
  maxTokens?: number;
  temperature?: number;
}

export interface Provider {
  name: string;
  /** True when the API key for this provider is set. */
  isConfigured(): boolean;
  /** Sends the prompt and returns the model's text reply. Throws on any failure. */
  generate(options: GenerateOptions): Promise<string>;
}

/** How long we wait for one provider before giving up and trying the fallback. */
export const PROVIDER_TIMEOUT_MS = 25_000;

/** Thrown when every provider in a chain failed or none had a key. */
export class CourtError extends Error {
  constructor(public code: "recess" | "missing_keys") {
    super(code);
  }
}

/** Throws a readable error for a non-OK HTTP response (status only — never the key). */
export async function ensureOk(res: Response, provider: string): Promise<void> {
  if (res.ok) return;
  const body = await res.text().catch(() => "");
  throw new Error(`${provider} HTTP ${res.status}: ${body.slice(0, 300)}`);
}

/**
 * Tries each provider in order and returns the first successful reply.
 * A provider is skipped if its key is missing; any error (429 rate limit,
 * timeout, 5xx outage, bad response) moves on to the next provider.
 */
export async function generateWithFallback(
  providers: Provider[],
  options: GenerateOptions,
): Promise<{ text: string; provider: string }> {
  const configured = providers.filter((p) => p.isConfigured());
  if (configured.length === 0) throw new CourtError("missing_keys");

  for (const [i, provider] of configured.entries()) {
    try {
      const text = await provider.generate(options);
      if (!text.trim()) throw new Error("empty reply");
      const label = i === 0 && provider === providers[0] ? provider.name : `${provider.name} (fallback)`;
      return { text, provider: label };
    } catch (error) {
      // Logged on the server only; users never see raw errors.
      console.error(`[ai] ${provider.name} failed:`, (error as Error).message);
    }
  }
  throw new CourtError("recess");
}
