"use client";
// Landing hero: editorial headline on the left, a sample court record writing itself on the right.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PARTY } from "@/lib/speakers";
import type { Speaker } from "@/lib/types";

// Illustration only — real debates are generated live by the AI agents.
const SAMPLE: { who: Speaker; tag: string; line: string }[] = [
  { who: "prosecutor", tag: "Opening", line: "A job offer pays you to learn. A master's degree charges you for the same lesson." },
  { who: "defender", tag: "Opening", line: "Some doors only open with the degree. Experience cannot buy a research role." },
  { who: "prosecutor", tag: "Rebuttal", line: "Only 'some' doors. My opponent hasn't shown the median graduate needs them." },
  { who: "judge", tag: "Ruling", line: "Round to the Prosecution, 7 to 6. Defence — evidence, not assertion." },
];

export function Hero() {
  const [shown, setShown] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setShown((n) => (n >= SAMPLE.length ? 1 : n + 1)), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="grain border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-24">
        <div>
          <p className="label">Multi-agent debate · For GD, debate & moot practice</p>
          <h1 className="mt-6 font-serif text-[3.4rem] leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-[5.6rem]">
            Every case has two sides. <em className="text-muted">Hear both argued.</em>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
            File a question. An AI prosecutor argues for it, an AI defender argues against, and an AI judge scores every
            round, calls out fallacies and explains the verdict.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/file" className="bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-brass">
              File a case →
            </Link>
            <a href="#how" className="text-sm text-muted underline decoration-line-strong underline-offset-4 hover:text-ink">
              How a hearing works
            </a>
          </div>
        </div>

        {/* Sample record */}
        <div className="self-end border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="label">Sample record</span>
            <span className="label text-faint">No. 0001</span>
          </div>
          <ol className="divide-y divide-line">
            {SAMPLE.map((s, i) => {
              const p = PARTY[s.who];
              const visible = i < shown;
              return (
                <motion.li
                  key={i}
                  animate={{ opacity: visible ? 1 : 0.12 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-[2.5rem_1fr] gap-3 px-5 py-4"
                >
                  <span className="pt-0.5 font-mono text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wide">
                      <span className={p.text}>{p.name}</span>
                      <span className="text-faint"> · {s.tag}</span>
                    </p>
                    <p className={`mt-1 leading-snug ${s.who === "judge" ? "text-sm text-muted" : "font-serif text-xl text-ink"}`}>
                      {s.line}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
