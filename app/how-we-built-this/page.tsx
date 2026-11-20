import type { Metadata } from "next";
import { PromptCard } from "@/components/prompts/PromptCard";
import { getPromptLog } from "@/lib/prompt-log";

export const metadata: Metadata = { title: "How we built this — Courtroom AI" };

export default function HowWeBuiltThis() {
  const entries = getPromptLog(); // read from /prompts/*.md at build time
  const tools = [...new Set(entries.map((e) => e.tool))];
  const techniques = [...new Set(entries.flatMap((e) => e.techniques))];

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <p className="label">The court record</p>
      <h1 className="mt-4 font-serif text-6xl leading-none sm:text-7xl">How we built this.</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Every prompt we used to build Courtroom AI: the exact wording, how we refined it, and what the AI produced. Built by
        Aaritra Kumar, Tanushree and Rounak.
      </p>

      <dl className="mt-14 grid grid-cols-3 border-y border-line">
        {[
          { n: entries.length, label: "Prompts" },
          { n: tools.length, label: tools.length === 1 ? "AI tool" : "AI tools" },
          { n: techniques.length, label: "Techniques" },
        ].map((s, i) => (
          <div key={s.label} className={`py-6 ${i > 0 ? "border-l border-line pl-5" : ""}`}>
            <dd className="font-serif text-5xl leading-none">{s.n}</dd>
            <dt className="label mt-2">{s.label}</dt>
          </div>
        ))}
      </dl>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-faint">Tools: {tools.join(", ") || "—"}</p>

      <div className="mt-14 border-t border-line">
        {entries.map((e) => (
          <PromptCard key={e.id} entry={e} />
        ))}
      </div>
    </div>
  );
}
