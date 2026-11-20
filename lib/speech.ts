"use client";
// Character voices using the FREE browser Web Speech API (no API key needed).
// Each character gets a different voice (when the browser has several) and pitch.

import type { Speaker } from "@/lib/types";

const VOICE_STYLE: Record<Speaker, { pitch: number; rate: number; pick: number }> = {
  judge: { pitch: 0.75, rate: 0.92, pick: 0 },
  prosecutor: { pitch: 1.0, rate: 1.08, pick: 1 },
  defender: { pitch: 1.3, rate: 1.02, pick: 2 },
};

export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

function englishVoices(): SpeechSynthesisVoice[] {
  const all = window.speechSynthesis.getVoices();
  const en = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
  return en.length ? en : all;
}

/** Speaks text in a character's voice. Resolves when finished (or immediately if unsupported). */
export function speak(text: string, speaker: Speaker): Promise<void> {
  if (!speechSupported() || !text.trim()) return Promise.resolve();
  return new Promise((resolve) => {
    const style = VOICE_STYLE[speaker];
    const utterance = new SpeechSynthesisUtterance(text.replace(/\[E\d+\]/g, ""));
    const voices = englishVoices();
    if (voices.length) utterance.voice = voices[style.pick % voices.length];
    utterance.pitch = style.pitch;
    utterance.rate = style.rate;
    // Safety net: some browsers never fire "end", so don't block the debate forever.
    const timer = window.setTimeout(resolve, 2000 + text.length * 90);
    const done = () => {
      window.clearTimeout(timer);
      resolve();
    };
    utterance.onend = done;
    utterance.onerror = done;
    window.speechSynthesis.cancel(); // stop anything still talking
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
export function pauseSpeaking() {
  if (speechSupported()) window.speechSynthesis.pause();
}
export function resumeSpeaking() {
  if (speechSupported()) window.speechSynthesis.resume();
}
