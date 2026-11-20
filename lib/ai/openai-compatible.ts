// Groq and Mistral both use the same "OpenAI-style" chat completions API,
// so one small helper serves both. We call it with plain fetch (no SDK needed).

import { ensureOk, PROVIDER_TIMEOUT_MS, type GenerateOptions } from "./provider";

export async function chatCompletion(params: {
  name: string;
  url: string;
  apiKey: string;
  model: string;
  options: GenerateOptions;
  extraBody?: Record<string, unknown>;
}): Promise<string> {
  const { name, url, apiKey, model, options, extraBody } = params;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: options.system }, ...options.messages],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 600,
      ...(options.json ? { response_format: { type: "json_object" } } : {}),
      ...extraBody,
    }),
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS), // counts as a failure → fallback
  });
  await ensureOk(res, name);

  const data = (await res.json()) as { choices?: { message?: { content?: string | null } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}
