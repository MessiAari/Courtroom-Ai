"use client";
// "File a case" form: free-text question OR a Case Library pick, plus Quick/Full format.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Timer, Zap } from "lucide-react";
import type { CaseFile, DebateMode } from "@/lib/types";
import { CASE_MAX, validateCase } from "@/lib/validation";
import { clearHistory, loadHistory, type HistoryEntry } from "@/lib/history";
import { PixelArt } from "@/components/ui/PixelArt";
import { GAVEL, GAVEL_COLORS } from "@/components/ui/pixel-icons";
import { Arrow, SpotlightCard, buttonClass } from "@/components/ui/primitives";

const WINNER = { prosecutor: "Prosecution", defender: "Defence", draw: "Drawn" } as const;
const WINNER_COLOR = { prosecutor: "text-pros", defender: "text-def", draw: "text-accent" } as const;
const SPECTRUM = ["#6EE7B7", "#10B981", "#059669"];

function Step({ n, title, hint, children }: { n: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-baseline gap-4">
        <span className="font-pixel text-2xl text-accent">{n}</span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
          {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function FileCaseForm({ cases, initialCaseId, initialTopic }: { cases: CaseFile[]; initialCaseId?: string; initialTopic?: string }) {
  const router = useRouter();
  const initial = cases.find((c) => c.id === initialCaseId);
  const [topic, setTopic] = useState(initial?.title ?? initialTopic?.slice(0, CASE_MAX) ?? "");
  const [caseId, setCaseId] = useState<string | undefined>(initial?.id);
  const [mode, setMode] = useState<DebateMode>("quick");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // localStorage only exists in the browser, so history is loaded after the first paint.
  useEffect(() => {
    const id = requestAnimationFrame(() => setHistory(loadHistory()));
    return () => cancelAnimationFrame(id);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateCase(topic);
    if (!result.ok) {
      setError(result.message); // "Case dismissed: …"
      return;
    }
    const params = new URLSearchParams({ topic: result.topic, mode });
    // Only attach the case id if the question still matches the picked case.
    const picked = cases.find((c) => c.id === caseId);
    if (picked && picked.title === result.topic) params.set("case", picked.id);
    setSubmitting(true);
    router.push(`/courtroom?${params}`);
  }

  const length = topic.trim().length;

  return (
    <form onSubmit={submit} className="space-y-16">
      <Step n="01" title="State the question" hint="A clear yes-or-no question works best.">
        <div
          className={`rounded-2xl border bg-surface p-5 transition-colors focus-within:border-accent sm:p-7 ${error ? "border-danger" : "border-line"}`}
        >
          <textarea
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setError(null);
              if (caseId && e.target.value !== cases.find((c) => c.id === caseId)?.title) setCaseId(undefined);
            }}
            rows={3}
            maxLength={CASE_MAX + 50}
            placeholder="Should attendance be optional in college?"
            className="w-full resize-none bg-transparent text-2xl font-medium leading-snug tracking-tight text-ink placeholder:text-faint focus:outline-none sm:text-4xl"
            aria-label="Your case"
            aria-invalid={Boolean(error)}
            aria-describedby="topic-meta"
          />
          <div id="topic-meta" className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-4">
            <span className="text-sm text-muted">
              {caseId ? "From the case library — counsel will cite its evidence." : "Or pick a researched case below."}
            </span>
            <span className="flex items-center gap-3">
              <span className="hidden h-1.5 w-24 overflow-hidden bg-line sm:block" aria-hidden>
                <span
                  className="block h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (length / CASE_MAX) * 100)}%`, background: length > CASE_MAX ? "#047857" : "#34D399" }}
                />
              </span>
              <span className={`font-pixel text-xs tabular-nums ${length > CASE_MAX ? "text-danger" : "text-faint"}`}>
                {length}/{CASE_MAX}
              </span>
            </span>
          </div>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0, x: [0, -8, 8, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-danger/50 bg-danger/[0.08] px-4 py-3 text-sm"
              role="alert"
            >
              <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} className="h-6 w-6 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </Step>

      <Step n="02" title="Or choose from the library" hint="Researched cases come with numbered evidence the lawyers must cite.">
        <div className="grid gap-4 md:grid-cols-3">
          {cases.map((c, i) => {
            const selected = c.id === caseId;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => {
                  setTopic(c.title);
                  setCaseId(c.id);
                  setError(null);
                }}
                aria-pressed={selected}
                className="text-left"
              >
                <SpotlightCard
                  color={SPECTRUM[i % 3]}
                  className={`flex h-full flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                    selected ? "border-accent bg-accent/[0.07]" : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-xs text-faint">No. {String(i + 1).padStart(3, "0")}</span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-sm border transition-colors ${
                        selected ? "border-accent bg-accent text-bg" : "border-line-strong"
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                  </div>
                  <span className="mt-6 block text-lg font-semibold leading-snug tracking-tight">{c.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">{c.description}</span>
                  <span className="mt-4 block font-mono text-[11px] uppercase tracking-wider text-faint">{c.facts.length} exhibits</span>
                </SpotlightCard>
              </button>
            );
          })}
        </div>
      </Step>

      <Step n="03" title="Choose the format">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { id: "quick", icon: Zap, title: "Quick hearing", meta: "≈ 2 min · 7 AI calls", text: "Opening statements → rebuttals → judgment." },
              { id: "full", icon: Timer, title: "Full hearing", meta: "≈ 5 min · 15 AI calls", text: "Adds cross-examination and closing statements." },
            ] as const
          ).map((m) => {
            const on = mode === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setMode(m.id)}
                aria-pressed={on}
                className={`rounded-2xl border p-6 text-left transition-all duration-300 ${
                  on ? "border-ink bg-ink text-bg" : "border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong"
                }`}
              >
                <div className="flex items-center justify-between">
                  <m.icon className={`h-5 w-5 ${on ? "text-accent" : "text-accent"}`} />
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${on ? "text-bg/60" : "text-faint"}`}>{m.meta}</span>
                </div>
                <p className="mt-8 text-2xl font-semibold tracking-tight">{m.title}</p>
                <p className={`mt-1 text-sm ${on ? "text-bg/70" : "text-muted"}`}>{m.text}</p>
              </button>
            );
          })}
        </div>
      </Step>

      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-lg font-semibold tracking-tight">Ready when you are, your honour.</p>
          <p className="mt-1 text-sm text-muted">Both sides are argued live by AI. You watch, then question the judge.</p>
        </div>
        <button type="submit" disabled={submitting} className={`${buttonClass("primary")} w-full !py-3.5 sm:w-auto`}>
          {submitting ? "Opening the hearing…" : "Open the hearing"} <Arrow />
        </button>
      </div>

      {history.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="label">Your recent judgments</p>
            <button
              type="button"
              onClick={() => {
                clearHistory();
                setHistory([]);
              }}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              Clear history
            </button>
          </div>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {history.map((h) => (
              <li key={h.date}>
                <button
                  type="button"
                  onClick={() => {
                    setTopic(h.topic);
                    setCaseId(h.caseId);
                    setMode(h.mode);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex w-full flex-wrap items-center justify-between gap-2 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-ink/90">{h.topic}</span>
                  <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
                    <span className={WINNER_COLOR[h.winner]}>{WINNER[h.winner]}</span>
                    <span className="font-pixel text-faint">
                      {h.prosecutorScore}–{h.defenderScore}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </form>
  );
}
