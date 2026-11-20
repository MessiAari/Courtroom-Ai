---
id: "005"
title: "Redesign: make it look designer-made, not AI-made"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Response evaluation", "Prompt refinement and optimization", "Clear instructions and constraints"]
date: "2026-11-20"
screenshot: ""
---

## Prompt (final version we sent)

> OK, now the site looks very AI-built. I want it to look like a professional designer built it.

## Before (optional: earlier, weaker version)

> Dark charcoal background with gold/brass accents; cinematic but clean. Avoid generic SaaS templates.
> Speech bubble with a typewriter effect above the active speaker; the speaker glows or bounces.
> "OBJECTION!" splash with a short screen shake.

## Why we changed it

- Following the original wording literally ("cinematic", "glows", "splash") produced the usual AI-template look: gold glows, gradients, spotlight halos, rounded pill buttons, icons in circles and letter-spaced capitals everywhere.
- We judged the output ourselves (response evaluation) and gave a clear quality bar instead of more decorations to add.

## Result

One concept for the whole site — **the court record**:

- **Design system:** warm near-black paper, ink-coloured text, a single brass accent; red and blue only mark the two sides. No glows, gradients or pill buttons — sharp rectangles and hairline rules.
- **Type:** Instrument Serif for what people say, Geist for UI, Geist Mono for docket metadata (case numbers, rounds, models).
- **Landing:** editorial headline ("Every case has two sides. Hear both argued.") next to a sample court record that writes itself; numbered "§" sections; cases listed like a docket.
- **Hearing:** the debate is a numbered **live court record**. A sticky docket bar holds a hairline credibility scale and the three parties (speaking / preparing / emotion). Statements type out in large serif; the Objection is a full-width red band.
- **Judgment:** reads like a printed judgment — "The court finds for the Prosecution.", a rubber stamp, a ruled schedule of scores, findings, and numbered GD points.
- File-a-case, setup, Ask the Judge and How-we-built-this pages restyled to match. Logic, API layer and agent prompts unchanged.

## What we learned

- Adjectives like "cinematic" and "premium" push AI tools toward clichés. Naming a single concept ("a court record") and listing what to remove gave a far more distinctive result.
