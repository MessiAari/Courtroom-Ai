// Display info for the three parties, shared by the landing page, courtroom and verdict.
import type { Speaker } from "@/lib/types";

export const PARTY: Record<Speaker, { name: string; short: string; stance: string; model: string; text: string; bg: string; border: string }> = {
  prosecutor: {
    name: "Prosecution",
    short: "PROS.",
    stance: "Argues for",
    model: "gpt-oss-120b · Groq",
    text: "text-pros",
    bg: "bg-pros",
    border: "border-pros",
  },
  judge: {
    name: "The Judge",
    short: "JUDGE",
    stance: "Presides",
    model: "Gemini Flash",
    text: "text-brass",
    bg: "bg-brass",
    border: "border-brass",
  },
  defender: {
    name: "Defence",
    short: "DEF.",
    stance: "Argues against",
    model: "gpt-oss-120b · Groq",
    text: "text-def",
    bg: "bg-def",
    border: "border-def",
  },
};
