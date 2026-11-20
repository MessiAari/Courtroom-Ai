---
id: "003"
title: "Approve the plan and build the app"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Step-by-step / chain"]
date: "2026-11-20"
screenshot: ""
---

## Prompt (final version we sent)

> I will give you the other prompts at the end. Build it. I will give you the Perplexity research later.

## Why we sent it

- Prompt 001 asked the AI to stop after the plan (chain prompting). After reviewing the plan we approved it, so the build ran in the agreed step order.
- We kept the Case Library facts as placeholders because the real facts will come from a separate Perplexity research step.

## Result

- Scaffolded Next.js 16 + TypeScript + Tailwind v4 and added Framer Motion, Lucide, zod and `@google/genai`.
- **Provider layer** (`lib/ai/provider.ts`): one `generate()` interface for Groq, Mistral and Gemini, with `generateWithFallback()` switching on 429, timeout, outage or a missing key.
- **Agent prompts** (`lib/ai/prompts.ts`): Prosecutor, Defender, Judge-round, Verdict and Ask-the-Judge prompts, each written as Role / Task / Context / Constraints / Output format.
- **Four API routes** (turn, judge, verdict, judge-chat). All JSON is validated with zod, retried once if broken, then falls back to plain text.
- **Debate loop** (`lib/debate/useDebate.ts`): the browser runs the debate one step at a time, fetching at most one step ahead of the screen, so pause, skip and retry never lose anything.
- Server-side safety check: the Judge's fallacy quote must really appear in the transcript before an OBJECTION is shown.
- Placeholder Case Library facts are never sent to the lawyers, so they can't cite fake evidence.

## What we learned

- A plan-first prompt (001) made "build it" enough as a follow-up: the AI already had an agreed structure to follow.
