// Case input validation. Used in the browser (instant feedback) AND on the server
// (so nobody can skip it by calling the API directly).

export const CASE_MIN = 10;
export const CASE_MAX = 300;

export type ValidationResult = { ok: true; topic: string } | { ok: false; message: string };

/**
 * Rough "is this gibberish?" check. Real sentences have vowels in most words,
 * don't repeat one character 5+ times, and use more than a handful of letters.
 */
export function looksLikeGibberish(text: string): boolean {
  const letters = text.replace(/[^a-z]/gi, "");
  if (letters.length < text.replace(/\s/g, "").length * 0.6) return true; // mostly symbols/digits
  if (/(.)\1{4,}/i.test(text)) return true; // "aaaaaa", "!!!!!!"
  if (new Set(letters.toLowerCase()).size < 5) return true; // "asasasas asas"

  const words = text.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  if (words.length === 0) return true;
  const withVowel = words.filter((w) => /[aeiouy]/.test(w)).length;
  if (withVowel / words.length < 0.7) return true; // "sdfkj qwrtp zxcvb"
  const longWords = words.filter((w) => w.length > 18).length;
  if (longWords / words.length > 0.3) return true; // "asdkjhaskdjhaksjdhakjsd"
  return false;
}

// SECURITY: obvious attempts to give the court orders instead of a debate topic.
// (The AI prompts also treat the case as data — this just stops the blatant ones early.)
const INJECTION: RegExp[] = [
  /\b(ignore|disregard|forget|override|bypass)\s+(all\s+)?(of\s+)?(your|previous|prior|above|earlier|system|these|those)\s+(\w+\s+)?(instructions?|prompts?|rules|guidelines)\b/i,
  /\b(system|developer|admin)\s*(prompt|message|override|mode|instructions?)\b/i,
  /\byou are now\b|\bpretend (to be|you are)\b|\bjailbreak\b|\bnew instructions?\b/i,
  /\b(declare|make|name|announce|rule)\b.{0,30}\b(prosecution|prosecutor|defen[cs]e|defender)\b.{0,20}\b(the )?(winner|wins?)\b/i,
  /\b(give|award)\b.{0,30}\b(prosecut\w*|defen\w*)\b.{0,20}\b(10|ten|full marks|zero|0)\b/i,
  /<\/?\s*(system|case|transcript|verdict|evidence|instructions?)\s*>/i,
];

// SECURITY: topics that attack people or ask for harm. Debatable policy questions
// (e.g. "Should assisted suicide be legal?", "Is the death penalty justified?") still pass.
const GROUPS =
  "races?|castes?|religions?|muslims?|hindus?|christians?|sikhs?|jews?|jewish|dalits?|tribals?|women|girls|men|gays?|lesbians?|lgbtq?\\+?|trans(gender)? people|black people|white people|immigrants?|refugees?|disabled people|north[- ]?east(ern)? people|south indians?|north indians?|biharis?";
const HARMFUL: RegExp[] = [
  // slurs (deliberately spelled loosely)
  /\bn[i1!]gg(a|er|ah?)s?\b|\bf[a@]gg?[o0]ts?\b|\br[e3]t[a@]rds?\b|\bchamars?\b|\bbhang(i|is)\b|\bk[i1]kes?\b|\bchinks?\b|\bpakis?\b|\bsp[i1]cs?\b|\btr[a@]nn(y|ies)\b/i,
  // a group described as inferior / to be removed or harmed
  new RegExp(`\\b(${GROUPS})\\b.{0,60}\\b(inferior|subhuman|vermin|animals|dirty|disgusting|deserve to die|should (all )?(die|be (killed|exterminated|eliminated|deported|segregated|sterili[sz]ed|wiped out)))\\b`, "i"),
  new RegExp(`\\b(kill|exterminate|wipe out|ethnically cleanse)\\b.{0,25}\\b(all )?(${GROUPS})\\b`, "i"),
  /\b(some|certain)\s+(races?|castes?|religions?)\b.{0,30}\b(inferior|superior)\b/i,
  // asking whether violence against PEOPLE is OK ("Is it right to kill animals for food?" still passes), or how to do it
  new RegExp(
    `\\b(ok(ay)?|fine|right|good|acceptable|justified|allowed)\\b.{0,15}\\bto\\s+(kill|murder|torture|lynch|beat up|stab|shoot|bomb|attack)\\b.{0,15}\\b(people|someone|anyone|others|humans?|them|those|a person|persons|kids|children|${GROUPS})\\b`,
    "i",
  ),
  /\b(ok(ay)?|fine|acceptable|justified|allowed)\b.{0,15}\bto\s+rape\b/i,
  /\bhow (to|do i|can i)\b.{0,20}\b(kill|murder|poison|make a bomb|build a bomb|hurt|stalk|kidnap)\b/i,
  // self-harm instructions
  /\b(kill|hurt|cut)\s+(myself|yourself)\b|\bkys\b|\bbest way to (die|end (my|your) life)\b/i,
  // removing or disenfranchising a protected group of PEOPLE
  // ("Should India deport illegal immigrants?" and "ban caste-based reservation" still pass)
  /\b(deport|expel|kick out|throw out|ban|segregate|sterili[sz]e|disenfranchise)\b.{0,20}\b(all\s+)?(muslims|hindus|christians|sikhs|jews|dalits|tribals|black people|white people|biharis|north[- ]?east(ern)? people|gays|lesbians|trans(gender)? people)(?![-\w])/i,
  /\b(muslims|hindus|christians|sikhs|jews|dalits|tribals|black people|white people|biharis|north[- ]?east(ern)? people|gays|lesbians|trans(gender)? people)\b.{0,20}\bbe\s+(deported|expelled|kicked out|thrown out|banned|segregated|sterili[sz]ed|disenfranchised)\b/i,
  // sexual content involving minors (policy debates like "Should porn be banned?" still pass)
  /\bsex with (a |an )?(minor|child|kid)s?\b|\bchild\s*(porn|abuse material)\b/i,
];

/** True when a case looks like an instruction to the court rather than a debate topic. */
export function looksLikeInjection(text: string): boolean {
  return INJECTION.some((r) => r.test(text));
}

/** True when a case attacks people or asks for harmful content. */
export function looksHarmful(text: string): boolean {
  return HARMFUL.some((r) => r.test(text));
}

/** Checks a case topic. Returns the cleaned topic, or a themed "Case dismissed" message. */
export function validateCase(input: string): ValidationResult {
  const topic = input.replace(/\s+/g, " ").trim();
  if (!topic) return { ok: false, message: "Case dismissed: the court cannot hear an empty case." };
  if (topic.length < CASE_MIN)
    return { ok: false, message: `Case dismissed: please state the case in at least ${CASE_MIN} characters.` };
  if (topic.length > CASE_MAX)
    return { ok: false, message: `Case dismissed: keep the case under ${CASE_MAX} characters.` };
  if (looksLikeGibberish(topic))
    return { ok: false, message: "Case dismissed: the court could not make sense of that. Try a clear question or statement." };
  if (looksHarmful(topic))
    return {
      ok: false,
      message: "Case dismissed: the court doesn't hear cases that attack people or ask for harm. Try rephrasing it as a fair, debatable question.",
    };
  if (looksLikeInjection(topic))
    return {
      ok: false,
      message: "Case dismissed: the court hears debate questions, not instructions to the court. State the case as a question or a claim.",
    };
  return { ok: true, topic };
}
