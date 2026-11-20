// Checks which API keys are configured (server only). Never returns key values.
import "server-only";

export interface EnvStatus {
  groq: boolean;
  mistral: boolean;
  gemini: boolean;
  /** Lawyers need Groq or Mistral; the Judge needs Gemini or Groq. */
  ready: boolean;
}

export function getEnvStatus(): EnvStatus {
  const groq = Boolean(process.env.GROQ_API_KEY);
  const mistral = Boolean(process.env.MISTRAL_API_KEY);
  const gemini = Boolean(process.env.GEMINI_API_KEY);
  return { groq, mistral, gemini, ready: (groq || mistral) && (gemini || groq) };
}
