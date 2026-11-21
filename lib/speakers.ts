// Display info for the three parties, shared by the landing page, courtroom and judgment.
// Palette "Jade bench": red = Prosecution, jade = Judge, blue = Defence.
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
    color: "#e5484d",
    text: "text-pros",
    bg: "bg-pros",
    border: "border-pros",
    icon: SWORD,
    // steel blade, red guard, dark-red grip
    iconColors: { a: "#dde3ea", b: "#e5484d", c: "#8a2a2d" },
  },
  judge: {
    name: "The Judge",
    stance: "Presides",
    model: "Gemini Flash",
    color: "#34d399",
    text: "text-judge",
    bg: "bg-judge",
    border: "border-judge",
    icon: SCALES,
    iconColors: { a: "#34d399", b: "#6ee7b7" },
  },
  defender: {
    name: "Defence",
    stance: "Argues against",
    model: "gpt-oss-120b · Groq",
    color: "#3e8bff",
    text: "text-def",
    bg: "bg-def",
    border: "border-def",
    icon: SHIELD,
    iconColors: { a: "#3e8bff", b: "#1e3f80" },
  },
};
