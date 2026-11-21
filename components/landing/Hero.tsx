"use client";
// Landing hero: a big, lit headline over a living pixel-art courtroom.
// - Headline lines rise out of a mask one by one; "two sides" is split into
//   the Prosecution's blue and the Defence's red, "argued" is the Judge's gold.
// - Lighting: a warm pool from above, three slow coloured beams, film grain
//   (global) and a vignette.
// - The scene (HeroCourt) shows the three AI agents debating and the Judge ruling.

import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/primitives";
import { HeroCourt } from "./HeroCourt";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** One headline line that slides up from behind a mask. */
function Line({ children, delay, className = "pb-[0.08em]" }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-clip border-b border-line">
      {/* Lighting */}
      <div className="ambient absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {[
          { left: "10%", color: "98,139,255" },
          { left: "50%", color: "200,155,85" },
          { left: "90%", color: "225,107,100" },
        ].map((b, i) => (
          <div
            key={b.left}
            className="animate-sweep absolute top-[-15%] h-[85%] w-[40vw] max-w-[560px] origin-top"
            style={{
              left: `calc(${b.left} - min(20vw, 280px))`,
              animationDelay: `${i * -3}s`,
              background: `linear-gradient(180deg, rgba(${b.color},0.12), transparent 80%)`,
              clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)",
              filter: "blur(14px)",
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_55%,rgba(0,0,0,0.55))]" aria-hidden />

      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex w-fit items-center gap-2.5 rounded-full border border-line-strong bg-surface/70 py-1.5 pl-2 pr-4"
        >
          <span className="flex gap-1" aria-hidden>
            <span className="h-2 w-2 bg-pros" />
            <span className="h-2 w-2 bg-gold-300" />
            <span className="h-2 w-2 bg-def" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">3 AI agents · 1 verdict</span>
        </motion.div>

        {/* Headline */}
        <h1 className="display mx-auto mt-7 max-w-6xl text-center text-[clamp(2.9rem,10.5vw,7.6rem)]">
          <Line delay={0.1}>Every case has</Line>
          <Line delay={0.22}>
            <span className="text-pros">two</span> <span className="text-def">sides.</span>
          </Line>
          <Line delay={0.34} className="pb-[0.2em]">
            <span className="text-muted">Hear both </span>
            <span className="relative inline-block text-gold-300">
              argued.
              {/* pixel underline that draws in */}
              <motion.span
                className="absolute -bottom-[0.16em] left-0 h-[0.07em] w-full origin-left bg-gold-300"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.05, ease: EASE }}
                aria-hidden
              />
            </span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-muted"
        >
          An AI <span className="text-pros">prosecutor</span> argues for your question, an AI <span className="text-def">defender</span> argues
          against, and an AI <span className="text-gold-300">judge</span> scores every round, calls out fallacies and decides who wins.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-9 flex flex-col items-center gap-4"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/file" className="!bg-gold-300 !px-6 !py-3.5 !text-bg hover:!bg-gold-200">
              File a case
            </ButtonLink>
            <ButtonLink href="/#preview" variant="secondary" className="!px-6 !py-3.5">
              Watch a sample hearing
            </ButtonLink>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Free · no sign-up · about two minutes a case</p>
        </motion.div>

        {/* The courtroom */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.85, duration: 1, ease: EASE }}
          className="-mx-2 mt-14 max-w-5xl sm:mx-auto sm:mt-16"
        >
          <HeroCourt />
        </motion.div>
      </div>
      <div className="h-14 sm:h-28" />
    </section>
  );
}
