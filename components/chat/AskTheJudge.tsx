"use client";
// "Ask the Judge" chatbot. Flow:
//   browser → POST /api/judge-chat { transcript, scores, verdict, messages }
//   → server builds the Judge's system prompt with the whole debate
//   → Gemini (fallback: Groq) → { reply } → shown here.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, RotateCcw, Trash2 } from "lucide-react";
import { EvidenceChip } from "@/components/courtroom/Evidence";
import type { CaseFact, ChatMessage, RoundScore, Turn, Verdict } from "@/lib/types";
import { PixelArt } from "@/components/ui/PixelArt";
import { BUBBLE, SCALES } from "@/components/ui/pixel-icons";
import { PixelLoader } from "@/components/courtroom/Record";
import { buttonClass } from "@/components/ui/primitives";

const SUGGESTIONS = ["Why did this side win?", "What was the weakest argument?", "Give me GD points", "How could the losing side win?"];
const MAX_LEN = 500;

export function AskTheJudge({
  topic,
  caseId,
  evidence,
  turns,
  scores,
  verdict,
}: {
  topic: string;
  caseId?: string;
  /** Web-researched evidence for typed-in topics (library evidence is loaded on the server). */
  evidence?: CaseFact[];
  turns: Turn[];
  scores: RoundScore[];
  verdict: Verdict;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view (inside the chat panel only).
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
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
          ...(evidence?.length ? { evidence } : {}),
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
    <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
      <div>
        <p className="label">
          <span className="font-pixel text-accent">Q&amp;A</span> &nbsp;Questions for the bench
        </p>
        <h2 className="display mt-4 text-4xl sm:text-6xl">Ask the Judge.</h2>
        <p className="mt-4 max-w-sm leading-relaxed text-muted">
          The Judge has the full record and the judgment. Ask why, what was weakest, or what to say in your own GD.
        </p>
        <PixelArt bitmap={BUBBLE} colors={{ a: "#C89B55", b: "#E6C88F" }} interactive className="mt-8 hidden h-16 w-20 lg:block" />
      </div>

      <div className="flex min-h-[26rem] flex-col overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/40 bg-accent/10">
              <PixelArt bitmap={SCALES} colors={{ a: "#C89B55", b: "#E6C88F" }} className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">The Judge</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-faint">Gemini · has the full record</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </header>

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-5" style={{ maxHeight: "32rem" }}>
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col justify-center gap-4 py-6">
              <p className="text-muted">Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-md border border-line-strong bg-raised px-3.5 py-2 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-4 py-3 text-[15px] leading-relaxed ${
                  m.role === "user" ? "rounded-br-sm bg-ink text-bg" : "rounded-bl-sm border border-line bg-raised text-ink"
                }`}
              >
                {m.role === "assistant" ? formatReply(m.content) : m.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted">
              <PixelLoader color="#C89B55" /> The Judge is considering…
            </div>
          )}

          {error && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-danger/40 bg-danger/[0.08] px-4 py-3 text-sm" role="alert">
              <span className="flex-1">{error}</span>
              {messages.at(-1)?.role === "user" && !loading && (
                <button onClick={() => send(messages)} className={`${buttonClass("primary")} !px-3 !py-1.5 text-xs`}>
                  <RotateCcw className="h-3.5 w-3.5" /> Retry
                </button>
              )}
            </div>
          )}
        </div>

        <form
          className="flex items-center gap-2 border-t border-line p-3"
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
            className="min-w-0 flex-1 rounded-md bg-transparent px-3 py-2.5 text-[15px] text-ink placeholder:text-faint focus:outline-none"
            aria-label="Your question for the Judge"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-bg transition-colors hover:bg-accent disabled:opacity-30"
            aria-label="Ask"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

/** Renders the Judge's reply as text: **bold** becomes bold, *italics* markers are dropped,
 *  and evidence tags like [E2] become the same clickable exhibit chips as in the record. */
function formatReply(text: string) {
  const clean = text.replace(/\*\*(\[E\d+\])\*\*/g, "$1").replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1$2");
  const inline = (part: string, key: string) =>
    part.split(/(\[E\d+\])/g).map((bit, j) => (/^\[E\d+\]$/.test(bit) ? <EvidenceChip key={`${key}-${j}`} n={Number(bit.slice(2, -1))} /> : bit));
  return clean.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {inline(part.slice(2, -2), String(i))}
      </strong>
    ) : (
      inline(part, String(i))
    ),
  );
}
