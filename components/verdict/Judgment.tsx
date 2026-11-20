"use client";
// The verdict, presented as a printed judgment. Reveal order:
// gavel strike → "The court finds for…" + stamp → score table → findings, GD points, share card.

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gavel } from "lucide-react";
import type { DebateMode, Side, Verdict } from "@/lib/types";

const FINDING = {
  prosecutor: "The court finds for the Prosecution.",
  defender: "The court finds for the Defence.",
  draw: "The court declares the case drawn.",
} as const;
const STAMP = { prosecutor: "For the Prosecution", defender: "For the Defence", draw: "Drawn" } as const;
const STAMP_COLOR = { prosecutor: "border-pros text-pros", defender: "border-def text-def", draw: "border-brass text-brass" } as const;
const CATEGORIES = ["reasoning", "evidence", "rebuttal", "logic"] as const;

function Bar({ value, max, side, delay }: { value: number; max: number; side: Side; delay: number }) {
  return (
    <div className="h-[3px] w-full bg-line">
      <motion.div
        className={`h-full ${side === "prosecutor" ? "bg-pros" : "bg-def"}`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      />
    </div>
  );
}

export function Judgment({ verdict, topic, mode }: { verdict: Verdict; topic: string; mode: DebateMode }) {
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(reduce ? 3 : 0); // 0 gavel · 1 finding + stamp · 2 scores · 3 details

  useEffect(() => {
    if (reduce) return;
    const t = [setTimeout(() => setBeat(1), 1300), setTimeout(() => setBeat(2), 2600), setTimeout(() => setBeat(3), 3800)];
    return () => t.forEach(clearTimeout);
  }, [reduce]);

  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <article className="pt-10">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
        <p className="label">Judgment · {mode === "full" ? "Full hearing" : "Quick hearing"}</p>
        <p className="label text-faint">{date}</p>
      </header>

      <p className="label mt-8">In the matter of</p>
      <p className="mt-2 max-w-4xl font-serif text-3xl leading-tight text-muted sm:text-4xl">{topic}</p>

      {/* Beat 0 — the gavel */}
      <div className="relative mt-10 min-h-[9rem]">
        {beat === 0 && (
          <div className="flex items-center gap-4">
            <motion.div
              style={{ originX: 0.85, originY: 0.85 }}
              animate={{ rotate: [-35, 6, -25, 6, -15, 6] }}
              transition={{ duration: 1.1, ease: "easeIn" }}
            >
              <Gavel className="h-10 w-10 text-brass" strokeWidth={1.25} />
            </motion.div>
            <p className="label">All rise.</p>
          </div>
        )}

        {/* Beat 1 — the finding and the stamp */}
        {beat >= 1 && (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl font-serif text-5xl leading-[1] sm:text-7xl"
              >
                {FINDING[verdict.winner]}
              </motion.h1>
              {verdict.reason && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
                >
                  {verdict.reason}
                </motion.p>
              )}
            </div>
            <motion.div
              initial={{ scale: 1.6, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: -5 }}
              transition={{ duration: 0.35, delay: 0.5, ease: [0.3, 1.4, 0.5, 1] }}
              className={`justify-self-start border-[3px] p-1 lg:mt-3 ${STAMP_COLOR[verdict.winner]}`}
            >
              <div className="border border-current px-5 py-3 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Courtroom AI · Judgment</p>
                <p className="mt-1 font-mono text-lg font-semibold uppercase tracking-wider">{STAMP[verdict.winner]}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Beat 2 — score table */}
      {beat >= 2 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-14">
          <p className="label">Schedule of scores</p>
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line-strong font-mono text-[11px] uppercase tracking-wide">
                <th className="w-[28%] py-3 font-normal text-faint">Criterion</th>
                <th className="py-3 pr-4 font-normal text-pros">Prosecution</th>
                <th className="py-3 font-normal text-def">Defence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <td className="py-4 text-ink">Overall</td>
                {(["prosecutor", "defender"] as const).map((side) => {
                  const v = side === "prosecutor" ? verdict.prosecutorScore : verdict.defenderScore;
                  return (
                    <td key={side} className="py-4 pr-4">
                      <p className="font-serif text-4xl leading-none tabular-nums sm:text-5xl">
                        {v}
                        <span className="ml-1 font-mono text-xs text-faint">/100</span>
                      </p>
                      <div className="mt-3">
                        <Bar value={v} max={100} side={side} delay={0.1} />
                      </div>
                    </td>
                  );
                })}
              </tr>
              {CATEGORIES.map((c, i) => (
                <tr key={c} className="border-b border-line">
                  <td className="py-3 text-sm capitalize text-muted">{c}</td>
                  {(["prosecutor", "defender"] as const).map((side) => (
                    <td key={side} className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-mono text-xs tabular-nums text-ink">{verdict.categories[c][side]}</span>
                        <Bar value={verdict.categories[c][side]} max={10} side={side} delay={0.25 + i * 0.1} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.section>
      )}

      {/* Beat 3 — findings, summary, GD points, share */}
      {beat >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <section className="mt-16 grid gap-10 md:grid-cols-2">
            {(["prosecutor", "defender"] as const).map((side) => (
              <div key={side}>
                <p className={`label ${side === "prosecutor" ? "text-pros" : "text-def"}`}>
                  Findings — {side === "prosecutor" ? "Prosecution" : "Defence"}
                </p>
                <dl className="mt-4 space-y-4 border-t border-line pt-4 text-sm leading-relaxed">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wide text-faint">Strengths</dt>
                    {verdict.strengths[side].length ? (
                      verdict.strengths[side].map((s, i) => <dd key={i} className="mt-1 text-ink/90">+ {s}</dd>)
                    ) : (
                      <dd className="mt-1 text-faint">None recorded.</dd>
                    )}
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-wide text-faint">Weaknesses</dt>
                    {verdict.weaknesses[side].length ? (
                      verdict.weaknesses[side].map((s, i) => <dd key={i} className="mt-1 text-ink/90">− {s}</dd>)
                    ) : (
                      <dd className="mt-1 text-faint">None recorded.</dd>
                    )}
                  </div>
                </dl>
              </div>
            ))}
          </section>

          <section className="mt-16 grid gap-4 border-t border-line pt-8 lg:grid-cols-[1fr_2fr]">
            <p className="label">The question, neutrally</p>
            <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">{verdict.summary}</p>
          </section>

          {verdict.takeaways.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                <p className="label text-brass">For your group discussion</p>
                <ol className="space-y-6">
                  {verdict.takeaways.map((t, i) => (
                    <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2">
                      <span className="font-serif text-3xl leading-none text-brass">{i + 1}</span>
                      <span className="text-lg leading-relaxed text-ink">{t}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          <ShareCard verdict={verdict} topic={topic} />
        </motion.div>
      )}
    </article>
  );
}

/** Compact, shareable verdict card (Web Share API, or copy to clipboard). */
function ShareCard({ verdict, topic }: { verdict: Verdict; topic: string }) {
  const [copied, setCopied] = useState(false);
  const text =
    `Courtroom AI — judgment\n“${topic}”\n${FINDING[verdict.winner]} Prosecution ${verdict.prosecutorScore}, Defence ${verdict.defenderScore}.\n` +
    (verdict.takeaways[0] ? `GD point: ${verdict.takeaways[0]}\n` : "");

  async function share() {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Courtroom AI judgment", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet cancelled — nothing to do.
    }
  }

  return (
    <section className="mt-16 grid gap-6 border-t border-line pt-8 lg:grid-cols-[1fr_2fr]">
      <p className="label">Share the judgment</p>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
        <div className="w-full max-w-sm border border-line-strong bg-surface p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Courtroom AI · Judgment</p>
          <p className="mt-4 font-serif text-xl leading-snug">{topic}</p>
          <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
            <p className={`font-mono text-xs uppercase tracking-wide ${STAMP_COLOR[verdict.winner].split(" ")[1]}`}>{STAMP[verdict.winner]}</p>
            <p className="font-mono text-xs tabular-nums text-muted">
              <span className="text-pros">{verdict.prosecutorScore}</span> — <span className="text-def">{verdict.defenderScore}</span>
            </p>
          </div>
        </div>
        <button onClick={share} className="border border-line-strong px-5 py-2.5 text-sm hover:border-ink">
          {copied ? "Copied to clipboard" : "Share"}
        </button>
      </div>
    </section>
  );
}
