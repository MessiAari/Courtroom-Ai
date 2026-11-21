"use client";
// Landing page sections below the hero.

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PixelArt } from "@/components/ui/PixelArt";
import { BUBBLE, GAVEL, GAVEL_COLORS } from "@/components/ui/pixel-icons";
import { ButtonLink, Marquee, PixelStairs, SpectrumBar, SpotlightCard } from "@/components/ui/primitives";
import { PixelMeter } from "@/components/ui/PixelMeter";
import { PARTY } from "@/lib/speakers";
import type { CaseFile } from "@/lib/types";
import { Reveal } from "./Reveal";
import { CastMember } from "@/components/court/Cast";

const TOPICS = [
  "Should attendance be optional in college?",
  "Is social media doing more harm than good?",
  "Should India adopt a four-day work week?",
  "Job offer or higher studies?",
  "Should AI tools be allowed in exams?",
  "Is remote work better than office work?",
  "Should coding be compulsory in school?",
  "Are entrance exams a fair test of merit?",
];

/** Clickable topic chips that scroll forever. */
export function TopicMarquee() {
  return (
    <section className="border-b border-line py-6" aria-label="Example topics">
      <Marquee duration={55}>
        {TOPICS.map((t) => (
          <Link
            key={t}
            href={`/file?topic=${encodeURIComponent(t)}`}
            className="group flex shrink-0 items-center gap-3 rounded-md border border-line bg-surface px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
          >
            <span className="h-2 w-2 bg-line-strong transition-colors group-hover:bg-accent" />
            {t}
          </Link>
        ))}
      </Marquee>
    </section>
  );
}

function SectionHead({ n, kicker, title, children }: { n: string; kicker: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label">
            <span className="font-pixel text-accent">{n}</span> &nbsp;{kicker}
          </p>
          <h2 className="display mt-4 max-w-3xl text-4xl sm:text-6xl">{title}</h2>
        </div>
        {children && <div className="max-w-md text-muted lg:pb-2">{children}</div>}
      </div>
    </Reveal>
  );
}

const STEPS = [
  { title: "File the case", text: "Type any debatable question, or pick a researched case from the library.", color: "#E6C88F" },
  { title: "Hear the arguments", text: "Both sides open, then rebut each other's actual points. Full hearings add cross-examination and closings.", color: "#C89B55" },
  { title: "Receive judgment", text: "The judge scores every round, objects to fallacies, and names a winner with reasons.", color: "#A97C3E" },
  { title: "Question the bench", text: "Ask the judge why, what was weakest, and what to say in your own group discussion.", color: "#8A6330" },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-5 pt-28 sm:px-8">
      <SectionHead n="02" kicker="Procedure" title="How a hearing works">
        Four steps, about two minutes. Every turn is a real call to a real AI model — nothing is scripted.
      </SectionHead>
      <ol className="mt-14 grid overflow-hidden rounded-xl border border-line sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="border-b border-line sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
            <Reveal delay={i * 0.07}>
              <SpotlightCard color={s.color} className="h-full p-6 sm:p-7">
                <p className="font-pixel text-5xl leading-none" style={{ color: s.color }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-10 text-xl font-semibold tracking-tight">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

const ROLE = {
  prosecutor: "Opens, rebuts, cross-examines and closes in favour of the motion.",
  judge: "Scores each round, objects to fallacies, delivers judgment and takes your questions.",
  defender: "Answers every point against the motion — same model, same rules.",
} as const;

export function Parties() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
      <SectionHead n="03" kicker="The parties" title={<>Three agents.<br />One fair fight.</>}>
        Both lawyers run on the same model with different briefs, so neither side starts ahead. The judge runs on a different
        model, so it never grades its own work.
      </SectionHead>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {(["prosecutor", "judge", "defender"] as const).map((who, i) => {
          const p = PARTY[who];
          return (
            <Reveal key={who} delay={i * 0.08}>
              <SpotlightCard as="article" color={p.color} className="h-full rounded-xl border border-line bg-surface transition-colors hover:border-line-strong">
                <div className="relative flex h-48 items-end justify-center overflow-hidden border-b border-line pt-6" style={{ background: `radial-gradient(70% 90% at 50% 100%, ${p.color}30, transparent 70%)` }}>
                  <CastMember who={who} className={`relative transition-transform duration-500 group-hover/spot:-translate-y-1 ${who === "judge" ? "w-32" : "w-24"}`} />
                  <PixelArt bitmap={p.icon} colors={p.iconColors} className="absolute right-4 top-4 h-6 w-6 opacity-80" />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-2xl font-semibold tracking-tight">{p.name}</p>
                    <p className={`font-mono text-[11px] uppercase ${p.text}`}>{p.stance}</p>
                  </div>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-faint">{p.model}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{ROLE[who]}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/** Small looping demo of the credibility scale for the bento grid. */
function MeterDemo() {
  const frames: [number, number][] = [[0, 0], [7, 6], [11, 14], [19, 21], [27, 22]];
  const [f, setF] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setF((n) => (n + 1) % frames.length), 1800);
    return () => clearInterval(t);
  }, [frames.length]);
  return <PixelMeter prosecution={frames[f][0]} defence={frames[f][1]} className="mt-6" />;
}

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
      <SectionHead n="04" kicker="In the courtroom" title="Built to make you a sharper debater." />
      <div className="mt-14 grid gap-4 md:grid-cols-6">
        {/* OBJECTION card */}
        <div className="group relative overflow-hidden rounded-xl bg-accent p-7 text-bg md:col-span-4 md:row-span-2 sm:p-9">
          <p className="font-mono text-[11px] uppercase tracking-wider text-bg/70">Fallacy detection</p>
          <motion.p
            className="mt-6 font-pixel text-[clamp(2.4rem,7.5vw,5.2rem)] leading-none md:text-[clamp(2.4rem,5.2vw,5.2rem)]"
            whileHover={{ x: [0, -6, 6, -3, 3, 0] }}
            transition={{ duration: 0.4 }}
          >
            OBJECTION!
          </motion.p>
          <p className="mt-6 max-w-md text-lg font-medium leading-snug">
            Strawman, ad hominem, false dilemma… the judge catches them, quotes the exact words, and docks points on the spot.
          </p>
          <p className="mt-6 inline-block rounded-md bg-bg/15 px-3 py-2 font-mono text-xs">
            “Anyone who disagrees has never had a real job.” → ad hominem · −4
          </p>
          <PixelStairs flip className="absolute -bottom-px -right-px w-40 opacity-60 mix-blend-multiply sm:w-56" />
        </div>

        <SpotlightCard color="#E16B64" className="rounded-xl border border-line bg-surface p-7 md:col-span-2">
          <p className="label">Credibility scale</p>
          <p className="mt-3 text-xl font-semibold tracking-tight">A live tug-of-war after every ruling.</p>
          <MeterDemo />
        </SpotlightCard>

        <SpotlightCard color="#C89B55" className="rounded-xl border border-line bg-surface p-7 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="label">Ask the Judge</p>
            <PixelArt bitmap={BUBBLE} colors={{ a: "#C89B55", b: "#E6C88F" }} className="h-6 w-6" />
          </div>
          <p className="mt-3 text-xl font-semibold tracking-tight">Question the bench after the verdict.</p>
          <p className="mt-3 rounded-md bg-raised px-3 py-2 text-sm text-muted">“What was the weakest argument?”</p>
        </SpotlightCard>

        <SpotlightCard color="#E6C88F" className="rounded-xl border border-line bg-surface p-7 md:col-span-3">
          <p className="label">GD takeaways</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">Leave with 3–5 points you can actually say out loud.</p>
          <ol className="mt-5 space-y-2 text-sm text-muted">
            <li><span className="font-pixel text-gold-200">1</span>&nbsp; Separate hours worked from output per hour.</li>
            <li><span className="font-pixel text-accent">2</span>&nbsp; Name where the policy fits — and where it doesn&apos;t.</li>
            <li><span className="font-pixel text-gold-500">3</span>&nbsp; Attack arguments, never people.</li>
          </ol>
        </SpotlightCard>

        <SpotlightCard color="#8A6330" className="rounded-xl border border-line bg-surface p-7 md:col-span-3">
          <div className="flex items-center justify-between">
            <p className="label">Judgment</p>
            <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} className="h-7 w-7 transition-transform duration-300 group-hover/spot:-rotate-12" />
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight">A verdict with reasons, not vibes.</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Scores for reasoning, evidence, rebuttal and logic, strengths and weaknesses for each side, and a neutral summary of
            the topic.
          </p>
        </SpotlightCard>
      </div>
    </section>
  );
}

export function Docket({ cases }: { cases: CaseFile[] }) {
  return (
    <section id="docket" className="mx-auto max-w-7xl scroll-mt-20 px-5 pt-28 sm:px-8">
      <SectionHead n="05" kicker="On the docket" title="Cases ready to hear">
        Researched cases come with evidence the lawyers must cite. Or bring your own question.
      </SectionHead>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {cases.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.07}>
            <Link href={`/file?case=${c.id}`} className="block h-full">
              <SpotlightCard color={["#E6C88F", "#A97C3E", "#8A6330"][i % 3]} className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-sm text-faint">No. {String(i + 1).padStart(3, "0")}</span>
                  <span className="font-mono text-[11px] uppercase text-faint">{c.facts.length} exhibits</span>
                </div>
                <p className="mt-8 text-2xl font-semibold leading-tight tracking-tight">{c.title}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Hear this case <span className="transition-transform group-hover/spot:translate-x-1">→</span>
                </span>
              </SpotlightCard>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          <SpectrumBar />
          <div className="grid gap-10 p-8 sm:p-14 lg:grid-cols-[2fr_1fr] lg:items-end">
            <div>
              <p className="label">Why we built it</p>
              <p className="display mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-[3.4rem]">
                Most people only hear one side.{" "}
                <span className="text-muted">Group discussions reward the ones who can argue both.</span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <ButtonLink href="/file">File your first case</ButtonLink>
              <p className="text-sm text-muted">For placement GDs, debate, MUN and moot court.</p>
            </div>
          </div>
          <PixelStairs flip className="pointer-events-none absolute -bottom-px right-0 w-28 opacity-30 sm:w-40" />
        </div>
      </Reveal>
    </section>
  );
}
