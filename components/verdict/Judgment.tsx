"use client";
// The verdict. Reveal order (the "verdict scene"):
// pixel gavel strikes → winner panel + stamp → animated pixel score bars → findings, GD points, share card.

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { DebateMode, Side, Verdict } from "@/lib/types";
import { PixelArt } from "@/components/ui/PixelArt";
import { BIG_SCALES, GAVEL, GAVEL_COLORS, STAMP as STAMP_ICON } from "@/components/ui/pixel-icons";
import { PixelStairs, SpotlightCard, buttonClass } from "@/components/ui/primitives";
import { PARTY } from "@/lib/speakers";

const FINDING = {
  prosecutor: "The court finds for the Prosecution.",
  defender: "The court finds for the Defence.",
  draw: "The court declares the case drawn.",
} as const;
const STAMP = { prosecutor: "For the Prosecution", defender: "For the Defence", draw: "Drawn" } as const;
const PANEL = { prosecutor: "#e5484d", defender: "#3e8bff", draw: "#34d399" } as const;
const CATEGORIES = ["reasoning", "evidence", "rebuttal", "logic"] as const;
const SPECTRUM = ["#6EE7B7", "#34D399", "#10B981", "#059669", "#047857"];

/** 10-block pixel bar that fills up to `value`. */
function BlockBar({ value, side, delay }: { value: number; side: Side; delay: number }) {
  const color = PARTY[side].color;
  return (
    <div className="flex gap-[3px]" aria-hidden>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          className="h-3 flex-1"
          initial={{ background: "#27272c" }}
          animate={{ background: i < value ? color : "#27272c" }}
          transition={{ delay: delay + i * 0.05, duration: 0.15 }}
        />
      ))}
    </div>
  );
}

export function Judgment({ verdict, topic, mode }: { verdict: Verdict; topic: string; mode: DebateMode }) {
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(reduce ? 3 : 0); // 0 gavel · 1 finding + stamp · 2 scores · 3 details

  useEffect(() => {
    if (reduce) return;
    const t = [setTimeout(() => setBeat(1), 1300), setTimeout(() => setBeat(2), 2500), setTimeout(() => setBeat(3), 3700)];
    return () => t.forEach(clearTimeout);
  }, [reduce]);

  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const panel = PANEL[verdict.winner];
  // The scales tip toward the winning side.
  const tilt = verdict.winner === "prosecutor" ? -9 : verdict.winner === "defender" ? 9 : 0;

  return (
    <article className="pt-10">
      {/* Beat 0 — the gavel */}
      {beat === 0 && (
        <div className="flex min-h-[26rem] flex-col items-center justify-center gap-6 rounded-2xl border border-line">
          <motion.div style={{ originX: 0.8, originY: 0.8 }} animate={{ rotate: [-40, 8, -28, 8, -16, 8] }} transition={{ duration: 1.1, ease: "easeIn" }}>
            <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} className="h-24 w-24" />
          </motion.div>
          <p className="font-pixel text-2xl text-accent">All rise.</p>
        </div>
      )}

      {/* Beat 1 — the winner panel and stamp */}
      {beat >= 1 && (
        <motion.section
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-2xl p-6 text-bg sm:p-10 lg:p-14"
          style={{ background: panel }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-bg/70">
            <span>Judgment · {mode === "full" ? "Full hearing" : "Quick hearing"}</span>
            <span>{date}</span>
          </div>
          <div className="relative mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-bg/70">In the matter of</p>
              <p className="mt-2 max-w-2xl text-xl font-medium leading-snug sm:text-2xl">{topic}</p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="display mt-8 text-5xl sm:text-6xl xl:text-7xl"
              >
                {FINDING[verdict.winner]}
              </motion.h1>
              {verdict.reason && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-bg/80">
                  {verdict.reason}
                </motion.p>
              )}
            </div>
            <div className="flex flex-col items-start gap-8 lg:items-end">
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: tilt }} transition={{ delay: 0.8, type: "spring", stiffness: 60, damping: 8 }}>
                <PixelArt bitmap={BIG_SCALES} colors={{ "#": "#0f0f11" }} className="h-24 w-32 opacity-90 sm:h-32 sm:w-44" label="Scales of justice" />
              </motion.div>
              {/* Pixel rubber stamp presses down, then the verdict mark appears */}
              <div className="relative flex flex-col items-start lg:items-end">
                <motion.div
                  initial={{ y: -36, opacity: 0 }}
                  animate={{ y: [-36, 6, 0], opacity: [0, 1, 1, 0.9] }}
                  transition={{ delay: 0.75, duration: 0.45, times: [0, 0.6, 1] }}
                  className="mb-2"
                >
                  <PixelArt bitmap={STAMP_ICON} colors={{ a: "#0f0f11", b: "#0f0f11", c: "#0f0f11" }} className="h-10 w-11 opacity-80" />
                </motion.div>
              <motion.div
                initial={{ scale: 2, opacity: 0, rotate: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: -6 }}
                transition={{ delay: 1.05, duration: 0.3, ease: [0.3, 1.4, 0.5, 1] }}
                className="border-[3px] border-bg p-1"
              >
                <div className="border border-bg px-5 py-3 text-center">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">Courtroom AI · Judgment</p>
                  <p className="mt-1 font-pixel text-lg font-bold uppercase sm:text-xl">{STAMP[verdict.winner]}</p>
                </div>
              </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Beat 2 — schedule of scores */}
      {beat >= 2 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid gap-4 lg:grid-cols-2">
          {(["prosecutor", "defender"] as const).map((side, si) => {
            const p = PARTY[side];
            const overall = side === "prosecutor" ? verdict.prosecutorScore : verdict.defenderScore;
            return (
              <SpotlightCard key={side} color={p.color} className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <PixelArt bitmap={p.icon} colors={p.iconColors} className="h-7 w-7" />
                    <p className={`text-lg font-semibold ${p.text}`}>{p.name}</p>
                  </div>
                  {verdict.winner === side && <span className="rounded-sm px-2 py-1 font-pixel text-xs text-bg" style={{ background: p.color }}>Winner</span>}
                </div>
                <p className="mt-6 font-pixel text-7xl leading-none tabular-nums sm:text-8xl" style={{ color: p.color }}>
                  {overall}
                  <span className="ml-2 font-mono text-sm text-faint">/100</span>
                </p>
                <div className="mt-8 space-y-4">
                  {CATEGORIES.map((c, i) => (
                    <div key={c} className="grid grid-cols-[5.5rem_1fr_1.5rem] items-center gap-3">
                      <span className="text-sm capitalize text-muted">{c}</span>
                      <BlockBar value={verdict.categories[c][side]} side={side} delay={0.2 + si * 0.15 + i * 0.12} />
                      <span className="text-right font-pixel text-sm tabular-nums">{verdict.categories[c][side]}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            );
          })}
        </motion.section>
      )}

      {/* Beat 3 — findings, summary, GD points, share */}
      {beat >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <section className="mt-4 grid gap-4 md:grid-cols-2">
            {(["prosecutor", "defender"] as const).map((side) => {
              const p = PARTY[side];
              return (
                <div key={side} className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                  <p className={`label ${p.text}`}>Findings — {p.name}</p>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-faint">Strengths</p>
                  <ul className="mt-2 space-y-2">
                    {verdict.strengths[side].length ? (
                      verdict.strengths[side].map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/90">
                          <span className="mt-1.5 h-2 w-2 shrink-0" style={{ background: p.color }} /> {s}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-faint">None recorded.</li>
                    )}
                  </ul>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-faint">Weaknesses</p>
                  <ul className="mt-2 space-y-2">
                    {verdict.weaknesses[side].length ? (
                      verdict.weaknesses[side].map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/90">
                          <span className="mt-1.5 h-2 w-2 shrink-0 border border-line-strong" /> {s}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-faint">None recorded.</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </section>

          <section className="mt-4 rounded-2xl border border-line bg-surface p-6 sm:p-10">
            <p className="label">The question, neutrally</p>
            <p className="mt-4 max-w-4xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{verdict.summary}</p>
          </section>

          {verdict.takeaways.length > 0 && (
            <section className="mt-16">
              <p className="label">
                <span className="font-pixel text-accent">GD</span> &nbsp;For your group discussion
              </p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">Points you can say out loud.</h2>
              <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {verdict.takeaways.map((t, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <SpotlightCard color={SPECTRUM[i % SPECTRUM.length]} className="h-full rounded-2xl border border-line bg-surface p-6">
                      <p className="font-pixel text-4xl leading-none" style={{ color: SPECTRUM[i % SPECTRUM.length] }}>
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-6 text-lg font-medium leading-snug">{t}</p>
                    </SpotlightCard>
                  </motion.li>
                ))}
              </ol>
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
    <section className="mt-16 grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="label">Share the judgment</p>
        <h2 className="display mt-4 text-4xl sm:text-5xl">Send it to your GD group.</h2>
        <button onClick={share} className={`${buttonClass("primary")} mt-8`}>
          {copied ? "Copied to clipboard ✓" : "Share verdict"}
        </button>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface p-7 sm:p-9">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">Courtroom AI · Judgment</p>
          <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} className="h-6 w-6" />
        </div>
        <p className="mt-6 text-2xl font-semibold leading-tight tracking-tight">{topic}</p>
        <div className="mt-8 flex items-end justify-between border-t border-line pt-5">
          <p className="font-pixel text-sm uppercase" style={{ color: PANEL[verdict.winner] }}>{STAMP[verdict.winner]}</p>
          <p className="font-pixel text-2xl tabular-nums">
            <span className="text-pros">{verdict.prosecutorScore}</span>
            <span className="text-faint"> – </span>
            <span className="text-def">{verdict.defenderScore}</span>
          </p>
        </div>
        <PixelStairs flip className="pointer-events-none absolute -bottom-px -right-px w-20 opacity-25" />
      </div>
    </section>
  );
}
