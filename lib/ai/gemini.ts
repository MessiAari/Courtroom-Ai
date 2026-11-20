// Google Gemini provider — the Judge and the "Ask the Judge" chatbot.
import { GoogleGenAI } from "@google/genai";
import { PROVIDER_TIMEOUT_MS, type GenerateOptions, type Provider } from "./provider";

let client: GoogleGenAI | null = null;

export const gemini: Provider = {
  name: "Gemini",
  isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
  async generate(options: GenerateOptions) {
    client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const call = client.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
      // Gemini calls the assistant role "model".
      contents: options.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: options.system,
        temperature: options.temperature ?? 0.4,
        maxOutputTokens: (options.maxTokens ?? 600) + 1000, // room for the model's thinking
        ...(options.json ? { responseMimeType: "application/json" } : {}),
        abortSignal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      },
    });
    const response = await call;
    return response.text ?? "";
  },
};
