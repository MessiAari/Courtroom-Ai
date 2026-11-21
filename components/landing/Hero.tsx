"use client";
// Landing hero: a flickering pixel field, a bold headline with an inline pixel
// pixel icon, and a live-looking preview of a hearing underneath.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlickeringGrid } from "@/components/ui/FlickeringGrid";
import { PixelArt } from "@/components/ui/PixelArt";
import { BIG_SCALES, GAVEL, GAVEL_COLORS } from "@/components/ui/pixel-icons";
import { ButtonLink, PixelStairs } from "@/components/ui/primitives";
import { PixelMeter } from "@/components/ui/PixelMeter";
import { PARTY } from "@/lib/speakers";
import type { Speaker } from "@/lib/types";

// Illustration only — real hearings are generated live by the AI agents.
const SAMPLE: { who: Speaker; tag: string; line: string; score: [number, number] }[] = [
  { who: "prosecutor", tag: "Opening", line: "A job offer pays you to learn. A master's degree charges you for the same lesson.", score: [0, 0] },
  { who: "defender", tag: "Opening", line: "Some doors only open with the degree. Experience can't buy you a research role.", score: [0, 0] },
  { who: "judge", tag: "Ruling", line: "Opening to the Prosecution, 7 to 6. Defence — evidence, not assertion.", score: [7, 6] },
  { who: "defender", tag: "Rebuttal", line: "My opponent calls it 'paid learning'. Paid learning in a role you'll outgrow in a year.", score: [7, 6] },
  { who: "prosecutor", tag: "Rebuttal", line: "Anyone who disagrees has simply never had a real job.", score: [7, 6] },
  { who: "judge", tag: "Objection", line: "Objection sustained — that's an ad hominem. Rebuttal to the Defence, 8 to 4.", score: [11, 14] },
];

const SPECTRUM_ROWS = ["#6EE7B7", "#6EE7B7", "#6EE7B7", "#34D399", "#34D399", "#34D399", "#10B981", "#10B981", "#10B981", "#059669", "#059669", "#047857", "#047857", "#047857", "#047857"];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SAMPLE.length), 3200);
    return () => clearInterval(t);
  }, []);
  const s = SAMPLE[i];
  const p = PARTY[s.who];

  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Background: flickering pixels + hairline grid */}
      <div className="absolute inset-0">
        <FlickeringGrid className="opacity-70" />
      </div>
      <div className="grid-lines absolute inset-0" aria-hidden />
      <PixelStairs className="absolute -bottom-px left-0 w-36 opacity-95 sm:w-56 lg:w-72" />
      <PixelStairs flip className="absolute -bottom-px right-0 hidden w-24 sm:flex lg:w-40" />

      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-16 sm:px-8 sm:pt-24 lg:pb-36">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="label text-center">
          Multi-agent debate arena · for GD, debate & moot practice
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="display mx-auto mt-6 max-w-5xl text-center text-[3.1rem] sm:text-7xl lg:text-[6.4rem]"
        >
          Every case has{" "}
          <span className="inline-block translate-y-[0.06em]">
            <PixelArt bitmap={BIG_SCALES} rowColors={SPECTRUM_ROWS} animateIn interactive className="inline h-[0.8em] w-[1.12em]" label="Pixel scales of justice" />
          </span>{" "}
          two sides.
          <br />
          <span className="text-muted">Hear both </span>
          <span className="bg-gradient-to-r from-jade-200 via-accent to-jade-500 bg-clip-text text-transparent">argued.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mt-8 max-w-xl text-center text-lg leading-relaxed text-muted"
        >
          File a question. An AI prosecutor argues for it, an AI defender argues against, and an AI judge scores every round,
          calls out fallacies and explains the verdict.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <ButtonLink href="/file">File a case</ButtonLink>
          <ButtonLink href="/#how" variant="secondary">How a hearing works</ButtonLink>
        </motion.div>

        {/* Live-looking preview of a hearing */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-xl border border-line-strong bg-surface/90 shadow-[0_40px_120px_-40px_rgba(52,211,153,0.35)] backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} className="h-4 w-4" />
              <span className="label">Sample hearing · No. 0001</span>
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 animate-pulse bg-accent" /> Live
            </span>
          </div>

          <div className="grid grid-cols-3 border-b border-line">
            {(["prosecutor", "judge", "defender"] as const).map((who) => {
              const active = who === s.who;
              const party = PARTY[who];
              return (
                <div
                  key={who}
                  className={`flex items-center gap-2 border-r border-line px-3 py-3 transition-colors duration-300 last:border-r-0 sm:gap-3 sm:px-5 ${active ? "" : "opacity-50"}`}
                  style={active ? { background: `${party.color}1f` } : undefined}
                >
                  <PixelArt bitmap={party.icon} colors={party.iconColors} className={`h-5 w-5 shrink-0 sm:h-6 sm:w-6 ${active ? "animate-bob" : ""}`} />
                  <span className="truncate text-xs font-medium sm:text-sm">{party.name}</span>
                </div>
              );
            })}
          </div>

          <div className="px-4 pb-5 pt-5 sm:px-6">
            <PixelMeter prosecution={s.score[0]} defence={s.score[1]} />
            <div className="mt-5 min-h-[7.5rem] sm:min-h-[6.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-wider">
                    <span className={p.text}>{p.name}</span>
                    <span className="text-faint"> · {s.tag}</span>
                  </p>
                  <p className={`mt-2 text-xl font-medium leading-snug tracking-tight sm:text-2xl ${s.tag === "Objection" ? "text-accent" : "text-ink"}`}>
                    {s.line}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
