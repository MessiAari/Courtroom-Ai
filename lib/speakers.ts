// Display info for the three parties, shared by the landing page, courtroom and judgment.
// Palette "Gilded bench": electric blue = Prosecution, gold = Judge, muted red = Defence.
import type { Speaker } from "@/lib/types";
import { SCALES, SHIELD, SWORD, type Bitmap } from "@/components/ui/pixel-icons";

export interface PartyInfo {
  name: string;
  stance: string;
  model: string;
  color: string; // hex, for pixel art and inline styles
  text: string; // Tailwind classes
  bg: string;
  border: string;
  icon: Bitmap;
  iconColors: Record<string, string>;
}

export const PARTY: Record<Speaker, PartyInfo> = {
  prosecutor: {
    name: "Prosecution",
    stance: "Argues for",
    model: "gpt-oss-120b · Groq",
    color: "#628BFF",
    text: "text-pros",
    bg: "bg-pros",
    border: "border-pros",
    icon: SWORD,
    // steel blade, red guard, dark-red grip
    iconColors: { a: "#dde3ea", b: "#628BFF", c: "#2A3D7A" },
  },
  judge: {
    name: "The Judge",
    stance: "Presides",
    model: "Gemini Flash",
    color: "#C89B55",
    text: "text-judge",
    bg: "bg-judge",
    border: "border-judge",
    icon: SCALES,
    iconColors: { a: "#C89B55", b: "#E6C88F" },
  },
  defender: {
    name: "Defence",
    stance: "Argues against",
    model: "gpt-oss-120b · Groq",
    color: "#E16B64",
    text: "text-def",
    bg: "bg-def",
    border: "border-def",
    icon: SHIELD,
    iconColors: { a: "#E16B64", b: "#7C3431" },
  },
};
