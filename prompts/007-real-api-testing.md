---
id: "007"
title: "Test with real API keys (and the Gemini bug it found)"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Response evaluation", "Step-by-step / chain"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

> Keys added — test it.

## Why we sent it

- Until now the debate had only been tested with simulated replies. We needed proof that all three agents work against the real Groq and Gemini APIs before deploying.

## Result

- **Lawyers (Groq `gpt-oss-120b`):** valid JSON with an emotion, about 1.2 s per turn. Rebuttals quote the opponent's actual words, which shows the full-transcript passing works.
- **Bug found — the Judge was silently using the fallback.** Every Judge reply said "via Groq (fallback)". The server log showed Gemini returning *404: model not found for API version v1*.
  - Cause: the `@google/genai` SDK defaults to the `v1` API, but preview Flash models only exist on `v1beta`.
  - We listed the models the key can use and timed each one: `gemini-3-flash-preview` ≈ 2 s, `gemini-3.5-flash` ≈ 4 s, while `gemini-3.8-flash` and `gemini-flash-latest` hung for 25 s+.
  - Fix: pinned `apiVersion: "v1beta"` in `lib/ai/gemini.ts`. The Judge now answers via Gemini in about 3 s.
- **Full Quick hearing end to end:** 7 real AI calls in about 45 s, ending in a reasoned judgment (a draw, 82–82) with findings and 4 GD points.
- **Ask the Judge:** answered "What was the weakest argument?" by quoting the debate and its own verdict.
- **Cross-examination** (Full mode): the question stayed under 40 words and the answer addressed it directly.
- Small fix: removed a stray full stop after topics ending in "?" in the Judge's opening line.

## What we learned

- The fallback chain hid the Gemini failure from users, which is good for them but meant we only noticed it by reading the `provider` label. Showing "via …" on every entry made the bug visible.
- Always test against the real API: the model name was correct, but the SDK's default API version was not.
