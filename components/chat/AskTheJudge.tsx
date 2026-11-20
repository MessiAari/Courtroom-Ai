"use client";
// "Ask the Judge" chatbot. Flow:
//   browser → POST /api/judge-chat { transcript, scores, verdict, messages }
//   → server builds the Judge's system prompt with the whole debate
//   → Gemini (fallback: Groq) → { reply } → shown here.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ChatMessage, RoundScore, Turn, Verdict } from "@/lib/types";

const SUGGESTIONS = ["Why did this side win?", "What was the weakest argument?", "Give me GD points", "How could the losing side win?"];
const MAX_LEN = 500;

export function AskTheJudge({
  topic,
  caseId,
  turns,
  scores,
  verdict,
}: {
  topic: string;
  caseId?: string;
  turns: Turn[];
  scores: RoundScore[];
  verdict: Verdict;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    if (messages.length || loading || error) endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading, error]);

  /** Sends the conversation to our API route and appends the Judge's reply. */
  async function send(history: ChatMessage[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/judge-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          caseId,
          transcript: turns.map(({ speaker, phase, kind, text }) => ({ speaker, phase, kind, text })),
          scores: scores.map(({ phase, prosecutorScore, defenderScore, fallacy }) => ({ phase, prosecutorScore, defenderScore, fallacy })),
          verdict,
          messages: history,
        }),
        signal: AbortSignal.timeout(60_000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.reply !== "string") {
        setError(
          data.error === "missing_keys"
            ? "The Judge's AI isn't configured on this server yet."
            : data.error === "invalid_input"
              ? "The court couldn't accept that question. Try rephrasing it."
              : "The court is in recess — the Judge couldn't be reached. Try again in a minute.",
        );
        return;
      }
      setMessages([...history, { role: "assistant", content: data.reply }]);
    } catch {
      setError("The court is in recess — the Judge couldn't be reached. Try again in a minute.");
    } finally {
      setLoading(false);
    }
  }

  function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return; // invalid input: empty
    if (q.length > MAX_LEN) {
      setError(`Please keep your question under ${MAX_LEN} characters.`);
      return;
    }
    const history: ChatMessage[] = [...messages, { role: "user", content: q }];
    setMessages(history);
    setInput("");
    send(history);
  }

  return (
    <section className="mt-20 grid gap-6 border-t border-line pt-8 lg:grid-cols-[1fr_2fr]">
      <div>
        <p className="label text-brass">Questions for the bench</p>
        <h2 className="mt-3 font-serif text-4xl leading-tight">Ask the Judge</h2>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
          The Judge has the full record and the judgment, and will answer questions about this hearing.
        </p>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            className="mt-4 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Clear conversation
          </button>
        )}
      </div>

      <div>
        {messages.length === 0 && !loading && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="border border-line-strong px-3.5 py-2 text-sm text-ink/90 transition-colors hover:border-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="divide-y divide-line">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[6rem_1fr]"
            >
              <p className={`font-mono text-[11px] uppercase tracking-wide ${m.role === "user" ? "text-faint" : "text-brass"}`}>
                {m.role === "user" ? "You" : "The Judge"}
              </p>
              <p className={`whitespace-pre-wrap leading-relaxed ${m.role === "user" ? "text-muted" : "text-ink"}`}>{m.content}</p>
            </motion.div>
          ))}
          {loading && (
            <div className="grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[6rem_1fr]">
              <p className="font-mono text-[11px] uppercase tracking-wide text-brass">The Judge</p>
              <p className="flex items-center gap-2 text-muted">
                Considering
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1 w-1 bg-brass"
                    animate={{ opacity: [0.15, 1, 0.15] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                  />
                ))}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 flex flex-wrap items-center gap-4 border-l-2 border-pros py-2 pl-4 text-sm" role="alert">
            <span className="flex-1 text-ink/90">{error}</span>
            {messages.at(-1)?.role === "user" && !loading && (
              <button onClick={() => send(messages)} className="bg-ink px-4 py-1.5 text-sm text-bg hover:bg-brass">
                Retry
              </button>
            )}
          </div>
        )}

        <form
          className="mt-6 flex items-end gap-3 border-b border-line-strong focus-within:border-ink"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_LEN + 50}
            placeholder="Ask about this hearing…"
            className="min-w-0 flex-1 bg-transparent py-3 text-lg text-ink placeholder:text-faint focus:outline-none"
            aria-label="Your question for the Judge"
          />
          <button type="submit" disabled={!input.trim() || loading} className="pb-3 text-sm text-ink disabled:text-faint">
            Ask →
          </button>
        </form>
        <div ref={endRef} />
      </div>
    </section>
  );
}
