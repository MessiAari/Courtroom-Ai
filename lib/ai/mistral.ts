// Mistral provider — fallback for the lawyers when Groq is rate-limited or down.
import { chatCompletion } from "./openai-compatible";
import type { GenerateOptions, Provider } from "./provider";

export const mistral: Provider = {
  name: "Mistral",
  isConfigured: () => Boolean(process.env.MISTRAL_API_KEY),
  generate: (options: GenerateOptions) =>
    chatCompletion({
      name: "Mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      apiKey: process.env.MISTRAL_API_KEY!,
      model: process.env.MISTRAL_MODEL || "mistral-small-latest",
      options,
    }),
};
