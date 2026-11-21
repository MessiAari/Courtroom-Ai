"use client";
// One prompt from our history, as an expandable row in the record.

import { useState } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PromptEntry } from "@/lib/prompt-log";

/** Markdown styled to match the site. */
function Md({ children }: { children: string }) {
  return (
    <div className="text-[15px] leading-relaxed text-ink/90">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: (p) => <p className="my-2" {...p} />,
          ul: (p) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-faint" {...p} />,
          ol: (p) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-faint" {...p} />,
          a: (p) => <a className="underline underline-offset-4 hover:text-accent" target="_blank" rel="noreferrer" {...p} />,
          strong: (p) => <strong className="font-medium text-ink" {...p} />,
          blockquote: (p) => <blockquote className="my-3 border-l-2 border-accent pl-4 text-lg font-medium leading-snug text-ink" {...p} />,
          h1: (p) => <p className="mt-4 font-mono text-xs uppercase text-accent" {...p} />,
          h2: (p) => <p className="mt-4 font-mono text-xs uppercase text-accent" {...p} />,
          h3: (p) => <p className="mt-4 font-medium text-ink" {...p} />,
          // Fenced blocks (```lang) render plain inside <pre>; inline `code` is mono.
          code: ({ className, ...p }) =>
            /language-/.test(className ?? "") ? <code {...p} /> : <code className="font-mono text-[0.88em] text-ink" {...p} />,
          pre: (p) => (
            <pre className="my-4 max-h-[34rem] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-bg p-5 font-mono text-xs leading-relaxed text-ink/80" {...p} />
          ),
          table: (p) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm" {...p} />
            </div>
          ),
          th: (p) => <th className="border-b border-line-strong py-2 pr-4 font-mono text-[11px] font-normal uppercase text-faint" {...p} />,
          td: (p) => <td className="border-b border-line py-2 pr-4 align-top" {...p} />,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}

export function PromptCard({ entry }: { entry: PromptEntry }) {
  const [open, setOpen] = useState(false);
  const prompt = entry.sections.find((s) => /^prompt/i.test(s.heading));
  const before = entry.sections.find((s) => /^before/i.test(s.heading));
  const rest = entry.sections.filter((s) => s !== prompt && s !== before);

  const TOOL_COLOR: Record<string, string> = { Claude: "#C89B55", ChatGPT: "#7FB39A", Perplexity: "#22d3ee", Gemini: "#628BFF" };
  const toolColor = TOOL_COLOR[entry.tool] ?? "#C89B55";

  return (
    <article className={`overflow-hidden rounded-2xl border transition-colors ${open ? "border-line-strong bg-surface" : "border-line hover:border-line-strong"}`}>
      <button
        className="grid w-full grid-cols-[3.5rem_1fr_auto] items-start gap-4 p-5 text-left transition-colors hover:bg-white/[0.02] sm:grid-cols-[5rem_1fr_auto] sm:p-6"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-pixel text-3xl leading-none text-faint sm:text-4xl">{entry.id}</span>
        <span>
          <span className="block text-xl font-semibold leading-tight tracking-tight sm:text-2xl">{entry.title}</span>
          <span className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-sm px-2 py-0.5 font-mono text-[11px] font-semibold uppercase" style={{ background: `${toolColor}22`, color: toolColor }}>
              {entry.tool}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
              {entry.author}
              {entry.date && ` · ${entry.date}`}
            </span>
          </span>
          <span className="mt-3 flex flex-wrap gap-1.5">
            {entry.techniques.map((t) => (
              <span key={t} className="rounded-sm border border-line px-2 py-0.5 text-xs text-muted">
                {t}
              </span>
            ))}
          </span>
        </span>
        <span className={`mt-1 flex h-7 w-7 items-center justify-center rounded-md border border-line-strong text-muted transition-transform ${open ? "rotate-45" : ""}`} aria-hidden>
          +
        </span>
      </button>

      {open && (
        <div className="space-y-8 border-t border-line p-5 sm:p-8">
          <div className={before ? "grid gap-4 lg:grid-cols-2" : ""}>
            {before && (
              <div className="rounded-xl border border-accent/30 bg-accent/[0.05] p-5">
                <p className="label text-accent">Before</p>
                <Md>{before.body}</Md>
              </div>
            )}
            {prompt && (
              <div className={before ? "rounded-xl border border-accent/30 bg-accent/[0.05] p-5" : ""}>
                <p className="label text-accent">{before ? "After" : "The prompt"}</p>
                <Md>{prompt.body}</Md>
              </div>
            )}
          </div>
          {rest.map((s) => (
            <div key={s.heading} className="border-t border-line pt-6">
              <p className="label">{s.heading}</p>
              <Md>{s.body}</Md>
            </div>
          ))}
          {entry.screenshot && (
            <Image
              src={entry.screenshot}
              alt={`Screenshot for prompt ${entry.id}`}
              width={1200}
              height={700}
              className="h-auto w-full rounded-xl border border-line"
            />
          )}
        </div>
      )}
    </article>
  );
}
