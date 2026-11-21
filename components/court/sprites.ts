// Original pixel-art characters for the courtroom scene, built from code.
// Each sprite is a grid of letters (one letter = one pixel colour, "." = empty).
// A character = a base body + a face for the current emotion + optional
// talking mouth and raised (gesturing) arm. Everything is 16 px wide.

import type { Emotion, Speaker } from "@/lib/types";

export type Grid = string[];

// ── Base lawyer: 16 × 23, front view. Rows 4–8 are the face. ──────────
const LAWYER_BASE: Grid = [
  ".....hhhhhh.....", // 0  hair
  "....hhhhhhhh....", // 1
  "...hhhhhhhhhh...", // 2
  "...hssssssssh...", // 3  forehead
  "...sbbssssbbs...", // 4  brows
  "...ssEssssEss...", // 5  eyes
  "...ssssssssss...", // 6
  "...sssmmmmsss...", // 7  mouth
  "....ssssssss....", // 8  chin
  "......SSSS......", // 9  neck
  "...cccwwwwccc...", // 10 collar
  "..ccccwttwcccc..", // 11 tie
  ".cccccwttwccccc.", // 12
  ".cccccCttCccccc.", // 13
  ".cc.ccCttCcc.cc.", // 14 arms
  ".cc.cccccccc.cc.", // 15
  ".cc.cccccccc.cc.", // 16
  ".ss.cccccccc.ss.", // 17 hands
  "....cccccccc....", // 18
  "....CCCCCCCC....", // 19
  "....kkk..kkk....", // 20 legs
  "....kkk..kkk....", // 21
  "...kkkk..kkkk...", // 22 shoes
];

// Hair styles so the two lawyers read as different people.
const HAIR_SHORT: Grid = LAWYER_BASE.slice(0, 4);
const HAIR_LONG: Grid = [
  "....hhhhhhhh....",
  "...hhhhhhhhhh...",
  "..hhhhhhhhhhhh..",
  "..hhsssssssshh..",
];
// Long hair also falls beside the face (rows 4–9).
const LONG_SIDES = [4, 5, 6, 7, 8, 9];

// ── Faces: rows 3–8, columns 3–12 (10 px) ────────────────────────────
type Face = Partial<Record<3 | 4 | 5 | 6 | 7 | 8, string>>;
const FACES: Record<Emotion, Face> = {
  neutral: { 4: "sbbssssbbs", 5: "ssEssssEss", 7: "sssmmmmsss" },
  confident: { 4: "sbbssssbbs", 5: "ssEssssEss", 7: "ssmssssmss", 8: "ssmmmmss" },
  angry: { 4: "ssbbssbbss", 5: "ssEssssEss", 7: "sssmmmmsss", 8: "smssssms" },
  smug: { 3: "hssssssbbh", 4: "sbbsssssss", 5: "ssEssssEss", 7: "sssssmmmms", 8: "sssssmss" },
  shocked: { 3: "hsbbssbbsh", 4: "ssssssssss", 5: "sEEssssEEs", 7: "ssssmmssss", 8: "sssmmsss" },
};
const TALK_MOUTH: Face = { 7: "ssssmmssss", 8: "sssmmsss" };

function put(grid: string[], row: number, col: number, text: string) {
  const r = grid[row];
  grid[row] = r.slice(0, col) + text + r.slice(col + text.length);
}

function applyFace(g: string[], face: Face) {
  for (const [k, v] of Object.entries(face)) {
    const row = Number(k);
    if (!v) continue;
    // rows 3–7 span columns 3–12; the chin (row 8) spans columns 4–11
    put(g, row, row === 8 ? 4 : 3, v);
  }
}

/** Raise the arm on the right-hand side of the grid (an objecting / pointing gesture). */
function raiseArm(g: string[]) {
  for (const r of [14, 15, 16, 17]) put(g, r, 13, "..");
  put(g, 7, 14, "ss");
  put(g, 8, 13, ".ss");
  put(g, 9, 13, "cc");
  put(g, 10, 13, "cc");
  put(g, 11, 13, "cc");
}

const mirror = (g: Grid): Grid => g.map((r) => [...r].reverse().join(""));

export interface Pose {
  emotion: Emotion;
  talking?: boolean; // mouth open frame
  gesture?: boolean; // raised arm toward the centre of the room
}

/** Builds a lawyer sprite. The Defence is mirrored so both lawyers face the bench. */
export function lawyerSprite(side: "prosecutor" | "defender", pose: Pose): Grid {
  const g = [...LAWYER_BASE];
  if (side === "defender") {
    HAIR_LONG.forEach((row, i) => (g[i] = row));
    for (const r of LONG_SIDES) {
      put(g, r, 2, "h");
      put(g, r, 13, "h");
    }
  } else {
    HAIR_SHORT.forEach((row, i) => (g[i] = row));
  }
  applyFace(g, FACES[pose.emotion] ?? FACES.neutral);
  if (pose.talking) applyFace(g, TALK_MOUTH);
  if (pose.gesture) raiseArm(g);
  // Prosecution stands on the left: its "right-hand" side already faces the bench.
  return side === "defender" ? mirror(g) : g;
}

// ── The Judge: 18 × 14 upper body (the bench hides the rest). ────────
const JUDGE_BASE: Grid = [
  "....HHHHHHHHHH....", // 0  wig
  "...HHHHHHHHHHHH...", // 1
  "..HHHhhhhhhhhHHH..", // 2
  "..HHhsssssssshHH..", // 3
  "..HHsbbssssbbsHH..", // 4  brows
  "..HHssEssssEssHH..", // 5  eyes
  "..HHssssssssssHH..", // 6
  "..HHsssmmmmsssHH..", // 7  mouth
  "..HH.ssssssss.HH..", // 8
  "..HH...SSSS...HH..", // 9
  "..cccctwwwwtcccc..", // 10 robe + gold collar
  ".ccccctwwwwtccccc.", // 11
  "cccccccwwwwccccccc", // 12
  "cccccccccccccccccc", // 13
];
const JUDGE_FACES: Record<"neutral" | "stern" | "pleased" | "thinking", Face> = {
  neutral: {},
  stern: { 4: "ssbbssbbss", 7: "sssmmmmsss" },
  pleased: { 7: "ssmssssmss", 8: "ssmmmmss" },
  thinking: { 4: "sbbsssssss", 5: "ssEssssEss", 7: "sssssmmsss" },
};
export type JudgeMood = keyof typeof JUDGE_FACES;

export function judgeSprite(mood: JudgeMood, talking = false): Grid {
  const g = [...JUDGE_BASE];
  // The judge's face sits one column further right (18-wide grid): columns 4–13.
  for (const [k, v] of Object.entries(JUDGE_FACES[mood])) {
    const row = Number(k);
    if (v) put(g, row, row === 8 ? 5 : 4, v);
  }
  if (talking) {
    put(g, 7, 4, "ssssmmssss");
    put(g, 8, 5, "sssmmsss");
  }
  return g;
}

// ── Colours per character ────────────────────────────────────────────
export const CAST_COLORS: Record<Speaker, Record<string, string>> = {
  prosecutor: {
    h: "#2b2420", b: "#2b2420", s: "#e8b98f", S: "#c9946b", E: "#101114", m: "#7a3b2e",
    w: "#e8dfce", t: "#1f2f66", c: "#628bff", C: "#3f5fc4", k: "#16151a",
  },
  defender: {
    h: "#17130f", b: "#17130f", s: "#c68e62", S: "#a6714a", E: "#101114", m: "#6b2f27",
    w: "#e8dfce", t: "#5e211d", c: "#e16b64", C: "#a9463f", k: "#16151a",
  },
  judge: {
    H: "#e8dfce", h: "#cfc5b2", b: "#8b8477", s: "#e3b48c", S: "#c08d66", E: "#101114", m: "#7a3b2e",
    w: "#f4eee2", t: "#c89b55", c: "#26242c", C: "#1b1a20",
  },
};

/** Gavel held by the Judge (head + handle), 8 × 5. */
export const GAVEL_SPRITE: Grid = ["aaaa....", "aaaabbbb", "aaaa....", "........", "........"];
export const GAVEL_SPRITE_COLORS = { a: "#c89b55", b: "#8a6330" };
