import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/Reveal";
import { getCases } from "@/lib/cases";
import { PARTY } from "@/lib/speakers";

const STEPS = [
  { title: "File the case", text: "Type any debatable question, or choose a researched case from the library." },
  { title: "Hear the arguments", text: "Both sides open, then rebut each other's actual points. The full debate adds cross-examination and closings." },
  { title: "Receive judgment", text: "The judge scores every round, objects to fallacies, and names a winner with reasons." },
  { title: "Question the bench", text: "Ask the judge why, what was weakest, and what to say in your own group discussion." },
];

export default function Home() {
  const cases = getCases();
  return (
    <>
      <Hero />

      {/* How a hearing works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-24">
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <p className="label">§ 1 — Procedure</p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">How a hearing works</h2>
          </div>
        </Reveal>
        <div className="mt-12 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="h-full border-b border-line py-6 sm:pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <p className="font-mono text-xs text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 text-lg text-ink">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The bench */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <p className="label">§ 2 — The parties</p>
            <div>
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">Three agents, one fair fight.</h2>
              <p className="mt-4 max-w-xl text-muted">
                Both lawyers run on the same model with different briefs, so neither side has an advantage. The judge runs on a
                different model so it isn&apos;t grading its own work.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
          {(["prosecutor", "judge", "defender"] as const).map((who) => {
            const p = PARTY[who];
            const role = {
              prosecutor: "Opens, rebuts, cross-examines and closes in favour of the motion.",
              judge: "Scores each round, raises objections to fallacies, delivers the judgment and takes your questions.",
              defender: "Answers every point against the motion, with the same model and the same rules.",
            }[who];
            return (
              <div key={who} className="bg-bg p-6">
                <div className={`h-0.5 w-8 ${p.bg}`} />
                <p className="mt-5 text-lg text-ink">{p.name}</p>
                <p className="label mt-1">{p.stance} · {p.model}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{role}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Docket */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <p className="label">§ 3 — On the docket</p>
            <h2 className="font-serif text-4xl leading-tight sm:text-5xl">Cases ready to hear</h2>
          </div>
        </Reveal>
        <ul className="mt-12 border-t border-line">
          {cases.map((c, i) => (
            <li key={c.id}>
              <Link
                href={`/file?case=${c.id}`}
                className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-line py-6 transition-colors hover:bg-surface sm:grid-cols-[6rem_1fr_auto] sm:px-2"
              >
                <span className="font-mono text-xs text-faint">No. {String(i + 1).padStart(3, "0")}</span>
                <span>
                  <span className="block font-serif text-2xl leading-tight text-ink sm:text-3xl">{c.title}</span>
                  <span className="mt-2 block max-w-2xl text-sm text-muted">{c.description}</span>
                </span>
                <span className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing statement */}
      <section className="mx-auto max-w-6xl px-5 pt-28">
        <Reveal>
          <figure className="border-l-2 border-brass pl-6 sm:pl-10">
            <blockquote className="max-w-4xl font-serif text-3xl leading-snug text-ink sm:text-5xl">
              Most people only ever hear one side. Group discussions reward the ones who can argue both — and spot the weak
              point in each.
            </blockquote>
            <figcaption className="label mt-6">Why we built it — for placement GDs, debate, MUN and moot court</figcaption>
          </figure>
          <Link href="/file" className="mt-12 inline-block bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-brass">
            File your first case →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
