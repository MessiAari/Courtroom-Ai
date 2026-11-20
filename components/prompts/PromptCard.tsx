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
          a: (p) => <a className="underline underline-offset-4 hover:text-brass" target="_blank" rel="noreferrer" {...p} />,
          strong: (p) => <strong className="font-medium text-ink" {...p} />,
          blockquote: (p) => <blockquote className="my-3 border-l-2 border-line-strong pl-4 font-serif text-xl leading-snug text-ink" {...p} />,
          h1: (p) => <p className="mt-4 font-mono text-xs uppercase text-brass" {...p} />,
          h2: (p) => <p className="mt-4 font-mono text-xs uppercase text-brass" {...p} />,
          h3: (p) => <p className="mt-4 font-medium text-ink" {...p} />,
          // Fenced blocks (```lang) render plain inside <pre>; inline `code` is mono.
          code: ({ className, ...p }) =>
            /language-/.test(className ?? "") ? <code {...p} /> : <code className="font-mono text-[0.88em] text-ink" {...p} />,
          pre: (p) => (
            <pre className="my-4 max-h-[34rem] overflow-auto whitespace-pre-wrap border border-line bg-surface p-5 font-mono text-xs leading-relaxed text-ink/80" {...p} />
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

  return (
    <article className="border-b border-line">
      <button
        className="grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 text-left transition-colors hover:bg-surface sm:grid-cols-[6rem_1fr_auto] sm:px-2"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-mono text-xs text-faint">No. {entry.id}</span>
        <span>
          <span className="block font-serif text-2xl leading-tight text-ink sm:text-3xl">{entry.title}</span>
          <span className="mt-2 block font-mono text-[11px] uppercase tracking-wide text-faint">
            <span className="text-brass">{entry.tool}</span> · {entry.author}
            {entry.date && ` · ${entry.date}`}
          </span>
          <span className="mt-1 block text-sm text-muted">{entry.techniques.join(" · ")}</span>
        </span>
        <span className="text-muted">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="space-y-10 pb-10 sm:pl-[7rem]">
          <div className={before ? "grid gap-8 lg:grid-cols-2" : ""}>
            {before && (
              <div>
                <p className="label text-pros">Before</p>
                <Md>{before.body}</Md>
              </div>
            )}
            {prompt && (
              <div>
                <p className="label">{before ? "After" : "The prompt"}</p>
                <Md>{prompt.body}</Md>
              </div>
            )}
          </div>
          {rest.map((s) => (
            <div key={s.heading} className="border-t border-line pt-5">
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
              className="h-auto w-full border border-line"
            />
          )}
        </div>
      )}
    </article>
  );
}
