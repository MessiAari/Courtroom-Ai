"use client";
// Landing hero: a dark, lit stage. Headline and CTAs on top; below, the three
// AI agents stand in their own spotlights. They take turns introducing
// themselves; hover or tap one to hear it (keyboard: Tab + Enter).

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PixelArt } from "@/components/ui/PixelArt";
import { BIG_SCALES } from "@/components/ui/pixel-icons";
import { ButtonLink } from "@/components/ui/primitives";
import { CastMember } from "@/components/court/Cast";
import { useBeat } from "@/components/court/useBeat";
import { PARTY } from "@/lib/speakers";
import type { Speaker } from "@/lib/types";

const ORDER: Speaker[] = ["prosecutor", "judge", "defender"];

const INTRO: Record<Speaker, { line: string; role: string }> = {
  prosecutor: { role: "Argues FOR", line: "I build the case for the motion — evidence first, then I go after the other side's points." },
  judge: { role: "Presides", line: "I score every round, call out fallacies on the spot, and explain my verdict." },
  defender: { role: "Argues AGAINST", line: "I take the other side — same model, same rules, different brief. No easy wins." },
};

const GOLD_ROWS = ["#E6C88F", "#E6C88F", "#E6C88F", "#D7B272", "#D7B272", "#C89B55", "#C89B55", "#C89B55", "#B88A47", "#B88A47", "#A97C3E", "#A97C3E", "#8A6330", "#8A6330", "#8A6330"];

export function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Speaker>("prosecutor");
  const [hold, setHold] = useState(false); // stop auto-cycling while the visitor picks one

  useEffect(() => {
    if (hold || reduce) return;
    const t = setInterval(() => setActive((a) => ORDER[(ORDER.indexOf(a) + 1) % ORDER.length]), 3600);
    return () => clearInterval(t);
  }, [hold, reduce]);

  const mouth = useBeat(!reduce, 170);
  const p = PARTY[active];
  const pick = (who: Speaker) => {
    setHold(true);
    setActive(who);
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {/* Lighting: warm pool from above + three slowly sweeping beams */}
      <div className="ambient absolute inset-0 -z-10" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {[
          { left: "14%", color: "98,139,255" },
          { left: "50%", color: "200,155,85" },
          { left: "86%", color: "225,107,100" },
        ].map((b, i) => (
          <div
            key={b.left}
            className="animate-sweep absolute top-[-10%] h-[120%] w-[38vw] max-w-[520px] origin-top"
            style={{
              left: `calc(${b.left} - min(19vw, 260px))`,
              animationDelay: `${i * -3}s`,
              background: `linear-gradient(180deg, rgba(${b.color},0.13), transparent 75%)`,
              clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="label text-center">
          <span className="text-gold-300">●</span>&nbsp; Multi-agent debate arena · GD, debate &amp; moot practice
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="display mx-auto mt-6 max-w-5xl text-center text-[3rem] sm:text-7xl lg:text-[6.4rem]"
        >
          Every case has{" "}
          <span className="inline-block translate-y-[0.06em]">
            <PixelArt bitmap={BIG_SCALES} rowColors={GOLD_ROWS} animateIn interactive className="inline h-[0.8em] w-[1.12em]" label="Pixel scales of justice" />
          </span>{" "}
          two sides.
          <br />
          <span className="text-muted">Hear both </span>
          <span className="text-gold-300">argued.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-7 max-w-xl text-center text-lg leading-relaxed text-muted"
        >
          File a question. An AI prosecutor argues for it, an AI defender argues against, and an AI judge scores every round,
          calls out fallacies and explains the verdict.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <ButtonLink href="/file">File a case</ButtonLink>
          <ButtonLink href="/#preview" variant="secondary">
            Watch a sample hearing
          </ButtonLink>
        </motion.div>

        {/* The stage: three agents in spotlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mx-auto mt-14 max-w-4xl"
          onMouseLeave={() => setHold(false)}
        >
          <div className="grid grid-cols-3 items-end gap-2 sm:gap-6">
            {ORDER.map((who) => {
              const on = who === active;
              const party = PARTY[who];
              return (
                <button
                  key={who}
                  type="button"
                  onMouseEnter={() => pick(who)}
                  onFocus={() => pick(who)}
                  onClick={() => pick(who)}
                  aria-pressed={on}
                  aria-label={`${party.name}: ${INTRO[who].role}`}
                  className="group relative flex flex-col items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                >
                  {/* spotlight cone */}
                  <span
                    className="pointer-events-none absolute bottom-10 left-1/2 h-[140%] w-[130%] -translate-x-1/2 transition-opacity duration-500"
                    style={{
                      opacity: on ? 1 : 0.2,
                      background: `linear-gradient(180deg, ${party.color}00, ${party.color}26 55%, ${party.color}3d)`,
                      clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
                      filter: "blur(10px)",
                    }}
                    aria-hidden
                  />
                  <CastMember
                    who={who}
                    emotion={on ? "confident" : "neutral"}
                    talking={on && mouth}
                    gesture={on && who !== "judge"}
                    animate={on && !reduce ? "talk" : "idle"}
                    className={`relative transition-[filter] duration-500 ${who === "judge" ? "w-full max-w-[11rem]" : "w-[73%] max-w-[8rem]"} ${on ? "" : "brightness-[0.55] group-hover:brightness-90"}`}
                  />
                  {/* pedestal */}
                  <span className="relative mt-1 h-2 w-[85%] transition-colors duration-500 sm:h-3" style={{ background: on ? party.color : "#2c2b31" }} />
                  <span className={`relative mt-3 font-pixel text-[10px] uppercase transition-colors sm:text-sm ${on ? party.text : "text-faint"}`}>{party.name}</span>
                  <span className="relative hidden font-mono text-[10px] uppercase tracking-wider text-faint sm:block">{INTRO[who].role}</span>
                </button>
              );
            })}
          </div>

          {/* What the active agent says */}
          <div className="relative mx-auto mt-8 min-h-[7rem] max-w-2xl rounded-xl border border-line-strong bg-surface/85 px-5 py-4 backdrop-blur sm:min-h-[5.5rem] sm:px-6">
            <span className="absolute -top-px left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                <p className="font-mono text-[11px] uppercase tracking-wider">
                  <span className={p.text}>{p.name}</span>
                  <span className="text-faint"> · {p.model}</span>
                </p>
                <p className="mt-1.5 text-lg leading-snug text-ink sm:text-xl">“{INTRO[active].line}”</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <div className="h-20 sm:h-28" />
    </section>
  );
}
