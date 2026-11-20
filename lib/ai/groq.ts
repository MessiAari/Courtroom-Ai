// Groq provider — runs openai/gpt-oss-120b for BOTH lawyers (same model = fair debate).
import { chatCompletion } from "./openai-compatible";
import type { GenerateOptions, Provider } from "./provider";

export const groq: Provider = {
  name: "Groq",
  isConfigured: () => Boolean(process.env.GROQ_API_KEY),
  generate: (options: GenerateOptions) =>
    chatCompletion({
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: process.env.GROQ_API_KEY!,
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      // gpt-oss "thinks" before answering; thinking tokens count against max_tokens,
      // so we give it extra room and keep the reasoning effort low to save quota.
      options: { ...options, maxTokens: (options.maxTokens ?? 600) + 1200 },
      extraBody: { reasoning_effort: "low" },
    }),
};
