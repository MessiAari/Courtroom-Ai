"use client";
// "Watch a sample hearing": a scripted, no-API demo of a full Quick hearing.
// It drives the same pixel CourtScene the real hearing uses: speakers talk,
// arguments type in, the Judge rules (+scores float up, the health bar moves),
// objects to an ad hominem, and finally reveals the verdict with a stamp.
// Plays when scrolled into view; Pause / Replay controls.

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Emotion, Side, Speaker } from "@/lib/types";
import { CourtScene, type SceneState } from "@/components/court/CourtScene";
import { PixelMeter } from "@/components/ui/PixelMeter";
import { ButtonLink, buttonClass } from "@/components/ui/primitives";
import { PARTY } from "@/lib/speakers";
import { PixelBurst } from "@/components/ui/PixelBurst";

type Step =
  | { kind: "say"; who: Speaker; round: number; label: string; emotion?: Emotion; text: string }
  | { kind: "rule"; round: number; label: string; pros: number; def: number; text: string; objection?: Side }
  | { kind: "verdict"; pros: number; def: number; winner: Side };

const TOPIC = "Job offer or higher studies?";

// Illustration only — real hearings are argued live by the AI agents.
const SCRIPT: Step[] = [
  { kind: "say", who: "judge", round: 1, label: "Opening", text: "Order. The court will hear: job offer or higher studies? The Prosecution argues for taking the job." },
  { kind: "say", who: "prosecutor", round: 1, label: "Opening", emotion: "confident", text: "A job offer pays you to learn. A master's degree charges you for the same lesson — and two years of salary." },
  { kind: "say", who: "defender", round: 1, label: "Opening", emotion: "neutral", text: "Some doors only open with the degree. Research roles and many abroad visas need it — experience can't buy that." },
  { kind: "rule", round: 1, label: "Opening", pros: 7, def: 6, text: "Opening to the Prosecution, 7 to 6. Defence — evidence, not assertion." },
  { kind: "say", who: "defender", round: 2, label: "Rebuttal", emotion: "smug", text: "My opponent says ‘paid learning’. Paid learning in a role you may outgrow in a year, with a ceiling you can't see yet." },
  { kind: "say", who: "prosecutor", round: 2, label: "Rebuttal", emotion: "angry", text: "Anyone who disagrees has simply never had a real job." },
  { kind: "rule", round: 2, label: "Rebuttal", pros: 4, def: 8, objection: "prosecutor", text: "Objection — that's an ad hominem. Attack the argument, not the person. Rebuttal to the Defence, 8 to 4." },
  { kind: "verdict", pros: 61, def: 74, winner: "defender" },
];

const SPEED = 22; // ms per character
const holdFor = (s: Step) => (s.kind === "verdict" ? 0 : s.text.length * SPEED + (s.kind === "rule" ? 2600 : 1500));

/** Types `text` out one character at a time (instant with reduced motion). */
function Typed({ text, paused }: { text: string; paused: boolean }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setN((c) => (c >= text.length ? c : c + 1)), SPEED);
    return () => clearInterval(t);
  }, [paused, reduce, text.length]);
  const shown = reduce ? text.length : n;
  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length && <span className="caret" />}
    </>
  );
}

export function SamplePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [run, setRun] = useState(0); // bumps on replay so typed lines restart

  const step = SCRIPT[i];
  const running = inView && playing;

  // Advance the script.
  useEffect(() => {
    if (!running || step.kind === "verdict") return;
    const t = setTimeout(() => setI((n) => Math.min(n + 1, SCRIPT.length - 1)), holdFor(step));
    return () => clearTimeout(t);
  }, [running, step, i]);

  const totals = useMemo(() => {
    let p = 0;
    let d = 0;
    SCRIPT.slice(0, i + 1).forEach((s) => {
      if (s.kind === "rule") {
        p += s.pros;
        d += s.def;
      }
    });
    return { p, d };
  }, [i]);

  const emotions = useMemo(() => {
    const e: Record<Side, Emotion> = { prosecutor: "neutral", defender: "neutral" };
    SCRIPT.slice(0, i + 1).forEach((s) => {
      if (s.kind === "say" && s.who !== "judge") e[s.who] = s.emotion ?? "neutral";
    });
    return e;
  }, [i]);

  const scene: SceneState = {
    speaking: !inView ? null : step.kind === "say" ? step.who : step.kind === "rule" ? "judge" : null,
    emotions,
    banner: !inView ? null : step.kind === "verdict" ? "Judgment" : `Round ${String(step.round).padStart(2, "0")} · ${step.label}`,
    objection: step.kind === "rule" ? (step.objection ?? null) : null,
    ruling: step.kind === "rule" ? { key: `${run}-${i}`, pros: step.pros, def: step.def } : null,
    paused: inView && !playing,
    winner: step.kind === "verdict" ? step.winner : null,
  };

  const replay = () => {
    setI(0);
    setRun((r) => r + 1);
    setPlaying(true);
  };

  // Transcript: the last three lines (newest last); on phones only the last two.
  const said = SCRIPT.slice(0, i + 1)
    .map((s, n) => ({ s, n }))
    .filter((x): x is { s: Exclude<Step, { kind: "verdict" }>; n: number } => x.s.kind !== "verdict")
    .slice(-3); // keep the current line in view

  return (
    <section id="preview" className="mx-auto max-w-7xl scroll-mt-20 px-5 pt-28 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label">
            <span className="font-pixel text-gold-300">01</span> &nbsp;Sample hearing
          </p>
          <h2 className="display mt-4 max-w-3xl text-4xl sm:text-6xl">Watch a case get argued.</h2>
        </div>
        <p className="max-w-md text-muted lg:pb-2">
          A scripted preview of a Quick hearing — openings, rebuttals, an objection and the verdict. Real hearings are argued live
          by the AI agents on any topic you file.
        </p>
      </div>

      <div ref={ref} className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
        {/* Header: case + controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <p className="min-w-0 truncate text-sm">
            <span className="label">Case No. 0001 ·</span> <span className="font-medium">{TOPIC}</span>
          </p>
          <div className="flex items-center gap-2">
            {step.kind !== "verdict" && (
              <button onClick={() => setPlaying((p) => !p)} className={`${buttonClass("secondary")} !px-3 !py-1.5 text-xs`} aria-label={playing ? "Pause the sample" : "Play the sample"}>
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? "Pause" : "Play"}
              </button>
            )}
            <button onClick={replay} className={`${buttonClass("secondary")} !px-3 !py-1.5 text-xs`}>
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="border-b border-line p-3 sm:p-5 lg:border-b-0 lg:border-r">
            <CourtScene state={scene} />
            <PixelMeter prosecution={totals.p} defence={totals.d} className="mt-4" />
            {/* step dots */}
            <div className="mt-4 flex gap-1" aria-hidden>
              {SCRIPT.map((_, n) => (
                <span key={n} className="h-1 flex-1 transition-colors duration-300" style={{ background: n <= i ? "#c89b55" : "#2c2b31" }} />
              ))}
            </div>
          </div>

          {/* Transcript / verdict */}
          <div className="relative min-h-[22rem] p-4 sm:p-6" aria-live="polite">
            <AnimatePresence mode="wait">
              {step.kind === "verdict" ? (
                <VerdictReveal key={`v${run}`} pros={step.pros} def={step.def} winner={step.winner} onReplay={replay} />
              ) : (
                <motion.ol key={`t${run}`} className="space-y-3" exit={{ opacity: 0 }}>
                  {said.map(({ s, n }, k) => {
                    const who: Speaker = s.kind === "say" ? s.who : "judge";
                    const party = PARTY[who];
                    const current = k === said.length - 1;
                    return (
                      <motion.li
                        key={n}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: current ? 1 : 0.55, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-lg border p-3.5 ${k < said.length - 2 ? "hidden sm:block" : ""} ${s.kind === "rule" && s.objection ? "border-gold-300/60 bg-gold-300/[0.07]" : "border-line bg-bg/40"}`}
                        style={current ? { borderLeft: `3px solid ${party.color}` } : undefined}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-wider">
                          <span className={party.text}>{party.name}</span>
                          <span className="text-faint"> · {s.kind === "rule" ? (s.objection ? "Objection" : "Ruling") : s.label}</span>
                          {s.kind === "rule" && (
                            <span className="float-right font-pixel">
                              <span className="text-pros">{s.pros}</span>
                              <span className="text-faint"> – </span>
                              <span className="text-def">{s.def}</span>
                            </span>
                          )}
                        </p>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
                          {current ? <Typed key={`${run}-${n}`} text={s.text} paused={!running} /> : s.text}
                        </p>
                      </motion.li>
                    );
                  })}
                </motion.ol>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Verdict: gavel-stamp press, scores counting up, and a pixel confetti burst in the winner's colour. */
function VerdictReveal({ pros, def, winner, onReplay }: { pros: number; def: number; winner: Side; onReplay: () => void }) {
  const party = PARTY[winner];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex h-full flex-col items-center justify-center py-4 text-center">
      <PixelBurst color={party.color} />
      <p className="label">The court finds</p>
      <motion.p
        initial={{ scale: 2.4, rotate: -14, opacity: 0 }}
        animate={{ scale: 1, rotate: -4, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.25 }}
        className="mt-4 border-4 px-5 py-2 font-pixel text-2xl uppercase sm:text-3xl"
        style={{ borderColor: party.color, color: party.color }}
      >
        For the {winner === "prosecutor" ? "Prosecution" : "Defence"}
      </motion.p>
      <div className="mt-7 flex items-end gap-6 font-pixel tabular-nums">
        <div>
          <CountUp to={pros} className="text-5xl text-pros" />
          <p className="mt-1 font-mono text-[10px] uppercase text-faint">Prosecution</p>
        </div>
        <span className="pb-6 text-faint">–</span>
        <div>
          <CountUp to={def} className="text-5xl text-def" />
          <p className="mt-1 font-mono text-[10px] uppercase text-faint">Defence</p>
        </div>
      </div>
      <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
        The Prosecution opened stronger, but the ad hominem cost it the rebuttal — and the case.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <ButtonLink href="/file">File your own case</ButtonLink>
        <button onClick={onReplay} className={buttonClass("secondary")}>
          <RotateCcw className="h-4 w-4" /> Replay
        </button>
      </div>
    </motion.div>
  );
}

function CountUp({ to, className }: { to: number; className?: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start - 500) / 900);
      setN(Math.round(to * Math.max(0, 1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, reduce]);
  return <p className={className}>{n}</p>;
}
