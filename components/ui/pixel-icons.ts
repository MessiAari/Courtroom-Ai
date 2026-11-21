// Original pixel-art bitmaps. Each string is one row; each character is one pixel.
// "." = empty, letters map to colours passed to <PixelArt>.

export type Bitmap = string[];

/** Scales of justice — the Judge. */
export const SCALES: Bitmap = [
  ".....a.....",
  "....aaa....",
  ".aaaaaaaaa.",
  ".b...a...b.",
  "b.b..a..b.b",
  "bbb..a..bbb",
  ".....a.....",
  "...aaaaa...",
  "..aaaaaaa..",
];

/** Sword — the Prosecution. */
export const SWORD: Bitmap = [
  "........a",
  ".......aa",
  "......aa.",
  ".....aa..",
  ".b..aa...",
  "..baa....",
  "..cb.....",
  ".c..b....",
  "c........",
];

/** Shield — the Defence. */
export const SHIELD: Bitmap = [
  "aaaaaaaaa",
  "abbbbbbba",
  "abbbabbba",
  "abbaaabba",
  "abbbabbba",
  ".abbbbba.",
  ".abbbbba.",
  "..abbba..",
  "...aaa...",
];

/** Gavel. */
export const GAVEL: Bitmap = [
  "..aa......",
  ".aaaa.....",
  "aaaaaa....",
  ".aaaaaa...",
  "..aaaaab..",
  "...aaa.b..",
  ".......bb.",
  "........bb",
  ".cccccc...",
  "cccccccc..",
];

/** Gavel colours: ivory head, stone handle, jade sound block. */
export const GAVEL_COLORS = { a: "#ede6d6", b: "#9a948a", c: "#10b981" };

/** Rubber verdict stamp (handle, body, inked face). */
export const STAMP: Bitmap = [
  "...aaa...",
  "..aaaaa..",
  "...aaa...",
  "....a....",
  "....a....",
  ".bbbbbbb.",
  "bbbbbbbbb",
  "ccccccccc",
];
export const STAMP_COLORS = { a: "#9a948a", b: "#10b981", c: "#047857" };

/** Pixel heart — the health-bar icon. */
export const HEART: Bitmap = [
  ".aa.aa.",
  "aabaaaa",
  "aaaaaaa",
  ".aaaaa.",
  "..aaa..",
  "...a...",
];

/** Speech bubble — Ask the Judge. */
export const BUBBLE: Bitmap = [
  "aaaaaaaaa",
  "a.......a",
  "a.b.b.b.a",
  "a.......a",
  "aaaaaaaaa",
  ".aa......",
  ".a.......",
];

/** Large hero scales (21 × 15), shaded row by row with the jade ramp. */
export const BIG_SCALES: Bitmap = [
  "..........#..........",
  ".........###.........",
  "..#################..",
  "..#.......#.......#..",
  ".#.#......#......#.#.",
  ".#.#......#......#.#.",
  "#...#.....#.....#...#",
  "#...#.....#.....#...#",
  "#####.....#.....#####",
  ".###......#......###.",
  "..........#..........",
  "..........#..........",
  "........#####........",
  "......#########......",
  ".....###########.....",
];
