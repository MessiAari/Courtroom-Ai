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
  return { ok: true, topic };
}
