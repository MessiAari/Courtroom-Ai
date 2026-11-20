"use client";
// "File a case" form: free-text question OR a Case Library pick, plus Quick/Full format.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseFile, DebateMode } from "@/lib/types";
import { CASE_MAX, validateCase } from "@/lib/validation";
import { clearHistory, loadHistory, type HistoryEntry } from "@/lib/history";

const WINNER = { prosecutor: "For the Prosecution", defender: "For the Defence", draw: "Drawn" } as const;

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line pt-6 lg:grid-cols-[1fr_2.2fr]">
      <p className="label">
        <span className="text-brass">{n}</span> — {title}
      </p>
      <div>{children}</div>
    </section>
  );
}

export function FileCaseForm({ cases, initialCaseId }: { cases: CaseFile[]; initialCaseId?: string }) {
  const router = useRouter();
  const initial = cases.find((c) => c.id === initialCaseId);
  const [topic, setTopic] = useState(initial?.title ?? "");
  const [caseId, setCaseId] = useState<string | undefined>(initial?.id);
  const [mode, setMode] = useState<DebateMode>("quick");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

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
    router.push(`/courtroom?${params}`);
  }

  return (
    <form onSubmit={submit} className="space-y-14">
      <Step n="01" title="The question">
        <textarea
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setError(null);
            if (caseId && e.target.value !== cases.find((c) => c.id === caseId)?.title) setCaseId(undefined);
          }}
          rows={2}
          maxLength={CASE_MAX + 50}
          placeholder="Should attendance be optional in college?"
          className="w-full resize-none border-b border-line-strong bg-transparent pb-3 font-serif text-3xl leading-tight text-ink placeholder:text-faint focus:border-ink focus:outline-none sm:text-4xl"
          aria-label="Your case"
          aria-invalid={Boolean(error)}
        />
        <div className="mt-2 flex justify-between gap-4 font-mono text-[11px] text-faint">
          <span>{caseId ? "From the case library — counsel will cite its evidence." : "A clear yes-or-no question works best."}</span>
          <span className={`tabular-nums ${topic.trim().length > CASE_MAX ? "text-pros" : ""}`}>
            {topic.trim().length}/{CASE_MAX}
          </span>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 border-l-2 border-pros pl-4 text-sm text-ink"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </Step>

      <Step n="02" title="Or choose from the library">
        <ul className="border-t border-line">
          {cases.map((c, i) => {
            const selected = c.id === caseId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setTopic(c.title);
                    setCaseId(c.id);
                    setError(null);
                  }}
                  aria-pressed={selected}
                  className={`grid w-full grid-cols-[1.5rem_1fr] gap-3 border-b border-line py-4 text-left transition-colors hover:bg-surface sm:px-2 ${
                    selected ? "bg-surface" : ""
                  }`}
                >
                  <span className={`mt-2 h-3 w-3 rounded-full border ${selected ? "border-brass bg-brass" : "border-line-strong"}`} />
                  <span>
                    <span className="block font-serif text-2xl leading-tight text-ink">{c.title}</span>
                    <span className="mt-1 block text-sm text-muted">{c.description}</span>
                    <span className="mt-2 block font-mono text-[11px] uppercase tracking-wide text-faint">
                      No. {String(i + 1).padStart(3, "0")} · {c.facts.length} exhibits
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Step>

      <Step n="03" title="Format">
        <div className="grid border border-line sm:grid-cols-2">
          {(
            [
              { id: "quick", title: "Quick hearing", meta: "≈ 2 min · 7 AI calls", text: "Opening statements, rebuttals, judgment." },
              { id: "full", title: "Full hearing", meta: "≈ 5 min · 15 AI calls", text: "Adds cross-examination and closing statements." },
            ] as const
          ).map((m, i) => (
            <button
              type="button"
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={`p-5 text-left transition-colors ${i === 1 ? "border-t border-line sm:border-l sm:border-t-0" : ""} ${
                mode === m.id ? "bg-ink text-bg" : "hover:bg-surface"
              }`}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-lg">{m.title}</span>
                <span className={`font-mono text-[11px] ${mode === m.id ? "text-bg/60" : "text-faint"}`}>{m.meta}</span>
              </span>
              <span className={`mt-1 block text-sm ${mode === m.id ? "text-bg/75" : "text-muted"}`}>{m.text}</span>
            </button>
          ))}
        </div>
      </Step>

      <div className="grid gap-4 border-t border-line pt-8 lg:grid-cols-[1fr_2.2fr]">
        <span className="hidden lg:block" />
        <div className="flex flex-wrap items-center gap-6">
          <button type="submit" className="bg-ink px-7 py-3.5 text-sm font-medium text-bg transition-colors hover:bg-brass">
            Open the hearing →
          </button>
          <p className="text-sm text-muted">Both sides are argued by AI. You watch, then question the judge.</p>
        </div>
      </div>

      {history.length > 0 && (
        <Step n="—" title="Your recent judgments">
          <ul className="border-t border-line">
            {history.map((h) => (
              <li key={h.date} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-3">
                <button
                  type="button"
                  onClick={() => {
                    setTopic(h.topic);
                    setCaseId(h.caseId);
                    setMode(h.mode);
                  }}
                  className="text-left text-ink/90 hover:text-ink hover:underline"
                >
                  {h.topic}
                </button>
                <span className="font-mono text-[11px] uppercase tracking-wide text-faint">
                  {WINNER[h.winner]} · {h.prosecutorScore}–{h.defenderScore}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              clearHistory();
              setHistory([]);
            }}
            className="mt-3 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Clear history
          </button>
        </Step>
      )}
    </form>
  );
}
