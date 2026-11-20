"use client";
// Optional debate history in localStorage (no database). Keeps the last 8 verdicts.

import type { DebateMode, Verdict } from "@/lib/types";

const KEY = "courtroom-ai:history";

export interface HistoryEntry {
  topic: string;
  mode: DebateMode;
  caseId?: string;
  winner: Verdict["winner"];
  prosecutorScore: number;
  defenderScore: number;
  date: string;
}

export function loadHistory(): HistoryEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: HistoryEntry) {
  try {
    const list = [entry, ...loadHistory().filter((e) => e.date !== entry.date)].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage full or blocked (private mode) — history is optional, so ignore.
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
