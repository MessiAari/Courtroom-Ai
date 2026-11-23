"use client";
// Evidence on file ("exhibits"). Lawyers cite facts as [E1]–[E6]:
// - in the record each tag is a chip you can hover / tap to read the fact and open its source;
// - the Exhibits panel lists every fact with its side and a link to the source page;
// - a badge says where the evidence came from (Case Library research, live web research,
//   or none — then the hearing is clearly marked "not fact-checked").

import { createContext, useContext } from "react";
import { ExternalLink } from "lucide-react";
import type { CaseFact, EvidenceKind } from "@/lib/types";

export const EvidenceContext = createContext<CaseFact[]>([]);

/** "www.thehindu.com/news/..." → "thehindu.com" */
export function siteOf(fact: CaseFact): string {
  try {
    return fact.sourceTitle?.startsWith("Wikipedia") ? "wikipedia.org" : new URL(fact.source).hostname.replace(/^www\./, "");
  } catch {
    return fact.sourceTitle ?? "source";
  }
}

const SIDE_STYLE = {
  for: { label: "FOR", cls: "text-pros border-pros/40 bg-pros/10" },
  against: { label: "AGAINST", cls: "text-def border-def/40 bg-def/10" },
} as const;

/** An [E2] tag inside a statement. Hover / focus shows the fact; click opens the source. */
export function EvidenceChip({ n }: { n: number }) {
  const facts = useContext(EvidenceContext);
  const fact = facts[n - 1];
  const chip = "mx-0.5 inline-block -translate-y-0.5 rounded-sm bg-accent/15 px-1.5 py-0.5 align-middle font-pixel text-[0.55em] text-accent";
  if (!fact) return <span className={chip}>E{n}</span>;
  return (
    <span className="group/ev relative inline-block align-middle">
      <a
        href={fact.source}
        target="_blank"
        rel="noopener noreferrer"
        className={`${chip} underline decoration-accent/40 underline-offset-2 transition-colors hover:bg-accent hover:text-bg focus-visible:bg-accent focus-visible:text-bg`}
        aria-label={`Exhibit E${n}: ${fact.fact} Source: ${siteOf(fact)}`}
      >
        E{n}
      </a>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden w-72 max-w-[80vw] -translate-x-1/2 rounded-lg border border-line-strong bg-raised p-3 text-left font-sans text-sm font-normal leading-snug tracking-normal text-ink shadow-xl group-hover/ev:block group-focus-within/ev:block"
      >
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">
          Exhibit E{n}
          {fact.side ? ` · ${SIDE_STYLE[fact.side].label}` : ""}
        </span>
        {fact.fact}
        <span className="mt-1.5 flex items-center gap-1 text-xs text-accent">
          {siteOf(fact)} <ExternalLink className="h-3 w-3" />
        </span>
      </span>
    </span>
  );
}

/** Small status line: where this hearing's facts come from. */
export function EvidenceBadge({ kind, count, researching }: { kind: EvidenceKind; count: number; researching: boolean }) {
  if (researching)
    return (
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-gold-200">
        <span className="h-1.5 w-1.5 animate-pulse bg-gold-300" /> The clerk is gathering evidence from the web…
      </p>
    );
  if (kind === "none")
    return (
      <p className="font-mono text-[11px] uppercase tracking-wider text-def">
        ⚠ Not fact-checked — no sources could be found, so the lawyers argue from general knowledge
      </p>
    );
  return (
    <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
      <span className="text-accent">✔ {count} exhibits on file</span> ·{" "}
      {kind === "library" ? "researched Case Library facts with sources" : "facts found by live web research, each with its source"}
    </p>
  );
}

/** The list of exhibits with links to their sources. */
export function ExhibitsPanel({ facts, kind, open = true }: { facts: CaseFact[]; kind: EvidenceKind; open?: boolean }) {
  if (!facts.length) return null;
  return (
    <details open={open} className="group rounded-xl border border-line bg-surface/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
        <span className="label">
          <span className="font-pixel text-accent">{facts.length}</span> &nbsp;Exhibits — evidence on file
        </span>
        <span className="text-xs text-muted group-open:hidden">Show +</span>
        <span className="hidden text-xs text-muted group-open:inline">Hide −</span>
      </summary>
      <ol className="space-y-2 border-t border-line p-3">
        {facts.map((f, i) => (
          <li key={i} className="flex gap-3 rounded-lg bg-bg/50 p-3">
            <span className="mt-0.5 shrink-0 font-pixel text-sm text-accent">E{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-ink">
                {f.side && <span className={`mr-2 inline-block rounded-sm border px-1.5 py-px align-middle font-mono text-[9px] font-semibold ${SIDE_STYLE[f.side].cls}`}>{SIDE_STYLE[f.side].label}</span>}
                {f.fact}
              </p>
              <a
                href={f.source}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-accent underline-offset-2 hover:underline"
              >
                {f.sourceTitle && !f.sourceTitle.includes(".") ? f.sourceTitle : siteOf(f)} <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </li>
        ))}
      </ol>
      <p className="border-t border-line px-4 py-2 text-[11px] leading-snug text-faint">
        {kind === "web"
          ? "Found by AI web research just before the hearing. Open the sources to check them — AI summaries can still contain mistakes."
          : "From our researched Case Library. Open the sources to check them."}
      </p>
    </details>
  );
}
