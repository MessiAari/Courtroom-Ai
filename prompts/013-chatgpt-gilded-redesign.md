---
id: "013"
title: "Redesign brief written by ChatGPT: cinematic hero, sample hearing, pixel-art courtroom"
author: "Tanushree"
tool: "Claude"
techniques: ["Structured", "Clear instructions and constraints", "Context-based", "Prompt refinement and optimization"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

> Redesign Courtroom AI focusing on these improvements:
>
> 1. **Hero:** Create a cinematic, visually striking hero with bold typography, dramatic lighting, clear CTAs, and a memorable visual demonstrating the three AI agents.
> 2. **Interactive debate preview:** Add a live sample debate with animated speakers, progressively appearing arguments, reactions, score updates, and a dramatic verdict reveal. Make it engaging without requiring API calls.
> 3. **Pixel-art courtroom:** During actual debates, create an animated pixel-art courtroom featuring Prosecution, Defence, and Judge as distinct characters. Include idle animations, speaking animations, reactions, round transitions, and a lively atmosphere. Make it feel like a polished miniature game, integrated into the actual debate interface rather than decorative artwork. The scene should react to the real debate state and current speaker.
> 4. **Visual identity & micro-interactions:** Use this colour palette consistently:
>    - Background: Charcoal `#101114`
>    - Surface: `#1B1A20`
>    - Text: Warm ivory `#E8DFCE`
>    - Judge: Gold `#C89B55`
>    - Prosecution: Electric blue `#628BFF`
>    - Defence: Muted red `#E16B64`
>
>    Add subtle grain textures, ambient lighting, smooth transitions, scroll reveals, tasteful hover effects, and satisfying verdict animations. Avoid excessive gradients, clutter, or distracting animations.
>
> Use 21st.dev for suitable components where appropriate. Preserve all existing functionality, APIs, routes, and debate logic. Ensure fully responsive mobile layouts. Inspect the codebase, implement directly, and test for regressions. Don't just create mockups.

## Why we sent it

- **This prompt was written by ChatGPT.** We asked ChatGPT for a redesign brief and sent its answer to Claude unchanged.
- After prompt 010 the site had pixel *props* (sword, shield, gavel) but no characters, and the hearing was still mostly a text record. We wanted the debate to feel like a game.
- Compared with our earlier design prompts (005, 009), this one is **numbered by area** and gives **exact hex colours**, so there was nothing for the AI to guess, and it names what to avoid ("excessive gradients, clutter").

## Result

- **New palette ("Gilded bench")** applied everywhere through the design tokens: gold Judge, electric-blue Prosecution, muted-red Defence, ivory text on charcoal. Added a **film-grain overlay** and **warm ambient light**.
- **Original pixel characters drawn in code** (`components/court/sprites.ts`): two lawyers with different hair and skin, a Judge in a wig behind the bench. Faces change with the AI's `emotion` (neutral, confident, angry, smug, shocked), with a talking mouth frame and a raised-arm gesture.
- **Live pixel courtroom** (`CourtScene.tsx`) in the real hearing, pinned beside the record on desktop:
  - **Characters:** the speaker steps into a coloured spotlight and talks; the next agent shows a thinking bubble.
  - **Rulings:** each one floats `+score` over the lawyers.
  - **Objections:** the Judge slams the gavel, the offender flinches with a "!", the other lawyer smirks, and the gallery jumps.
  - **Atmosphere:** round banners sweep across the room, and the lamps flicker.
- **Cinematic hero:** sweeping blue, gold and red spotlights, then the three agents on a stage. Hover or tap one to hear what it does.
- **Sample hearing** (no API calls): a scripted Quick hearing in the same courtroom scene, with typed arguments, a moving health bar, an ad hominem objection, and a verdict stamp with count-up scores and a pixel confetti burst. Plays when scrolled into view; Pause and Replay.
- **Verdict:** the real judgment panel also gets the pixel confetti burst.
- **21st.dev:** its component downloads need a signed-in account (we found this in prompt 009), so the effects were written by hand in the same spirit.
- **Testing:** a real hearing ran end to end; build, types and lint pass. At 375 px there's no horizontal scroll, and `prefers-reduced-motion` is respected.

## What we learned

- Giving **exact hex codes** ended the colour back-and-forth from prompts 007–010 in one step.
- "Integrated into the actual debate interface rather than decorative artwork" was the key constraint: it made the scene read live debate state (speaker, emotion, scores, objections) instead of being a looping animation.
