import type { Metadata } from "next";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PixelArt } from "@/components/ui/PixelArt";
import { BUBBLE } from "@/components/ui/pixel-icons";
import { getPromptLog } from "@/lib/prompt-log";

export const metadata: Metadata = { title: "How we built this — Courtroom AI" };

export default function HowWeBuiltThis() {
  const entries = getPromptLog(); // read from /prompts/*.md at build time
  const tools = [...new Set(entries.map((e) => e.tool))];
  const techniques = [...new Set(entries.flatMap((e) => e.techniques))];

  return (
    <div className="relative">
      <div className="grid-lines absolute inset-x-0 top-0 h-[28rem]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 pt-14 sm:px-8 sm:pt-20">
        <p className="label">The court record</p>
        <h1 className="display mt-5 text-6xl sm:text-8xl">
          How we{" "}
          <span className="inline-block translate-y-[0.05em]">
            <PixelArt bitmap={BUBBLE} colors={{ a: "#C89B55", b: "#8A6330" }} animateIn interactive className="inline h-[0.7em] w-[0.9em]" label="Pixel speech bubble" />
          </span>{" "}
          built this.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Every prompt we used to build Courtroom AI: the exact wording, how we refined it, and what the AI produced. Built by
          Aaritra Kumar, Tanushree and Rounak.
        </p>

        <dl className="mt-14 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { n: entries.length, label: "Prompts", color: "#E6C88F" },
            { n: tools.length, label: tools.length === 1 ? "AI tool" : "AI tools", color: "#A97C3E" },
            { n: techniques.length, label: "Techniques", color: "#8A6330" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-4 sm:p-7">
              <dd className="font-pixel text-4xl leading-none sm:text-7xl" style={{ color: s.color }}>
                {s.n}
              </dd>
              <dt className="label mt-3">{s.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-faint">Tools: {tools.join(", ") || "—"}</p>

        <div className="mt-14 space-y-3">
          {entries.map((e) => (
            <PromptCard key={e.id} entry={e} />
          ))}
        </div>
      </div>
    </div>
  );
}
