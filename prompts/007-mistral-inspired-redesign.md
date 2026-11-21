---
id: "007"
title: "Redesign: visually striking, modern and interactive"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Role-based", "Context-based", "Structured", "Clear instructions and constraints", "Step-by-step / chain"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

> Act as a senior UI/UX designer and frontend developer. Redesign the existing Courtroom AI website to make it visually striking, modern, interactive, and premium.
>
> **Visual direction:** Use Mistral.ai as inspiration for its bold typography, vibrant colours, clean layouts, visual hierarchy, and polished animations. Explore 21st.dev for suitable modern UI components and integrate them where they genuinely improve the design.
>
> Make the interface feel alive through subtle animations, hover effects, smooth transitions, engaging backgrounds, and better spacing. Improve typography, colours, cards, buttons, and overall visual hierarchy. Maintain the courtroom/debate identity while making it less generic and more memorable.
>
> **Constraints:** Preserve all existing functionality, API integrations, debate logic, routes, and working features. Don't unnecessarily rewrite the architecture or remove existing components/features. Make every page fully responsive, with special attention to mobile layouts and usability. Maintain performance, accessibility, and consistent design.
>
> **Execution:** Inspect the existing project first, then implement the redesign directly. Don't just suggest changes or create mockups. Test the result, fix any regressions, and ensure the project builds successfully.
>
> Prioritise exceptional visual quality over minimal cosmetic changes.

## Before (optional: earlier, weaker version)

> OK, now the site looks very AI-built. I want it to look like a professional designer built it. *(prompt 005)*

## Why we changed it

- Prompt 005 only said what we *didn't* want, and produced a restrained editorial design that felt too quiet for a game-like app.
- This prompt uses all five parts again: a role, a concrete visual reference, explicit constraints (keep every feature, mobile, accessibility) and an execution order (inspect → implement → test → fix → build).

## Result

- Claude studied mistral.ai and 21st.dev in the browser first. 21st.dev's component downloads need a signed-in account, so it rebuilt the patterns we needed itself: a **flickering pixel grid** background, a **pixel-dot spotlight** hover on cards, and an **infinite marquee** of clickable topics.
- New system: near-black canvas, heavy Geist headlines, a pixel font (Silkscreen) for numbers and the OBJECTION moment, hairline-celled header, pixel-art icons drawn in code.
- Landing: headline with an inline pixel scales icon, a live-looking sample hearing, topic marquee, numbered procedure cells, party cards, a bento grid of features, and the docket.
- Hearing: sticky bench bar (meter + party cells that light up), record entries as cards with pixel avatars and score chips, a full-width OBJECTION band.
- Judgment: a full-colour winner panel with tipping pixel scales and a stamp, pixel block score bars, findings, GD-point cards, and a share card.
- Tested with real debates on desktop and at 375 px; no horizontal scroll; build, lint and types pass.
- The first version used Mistral's own orange/yellow colours, which we changed in prompt 008.

## What we learned

- Naming a reference site gives the AI a strong direction, but it can copy the brand too literally. The next prompt had to say what to keep (pixel style) and what to make our own (colours).
