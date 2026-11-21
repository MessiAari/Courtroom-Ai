---
id: "014"
title: "Hero-only brief written by ChatGPT: a living pixel courtroom"
author: "Tanushree"
tool: "Claude"
techniques: ["Structured", "Clear instructions and constraints", "Prompt refinement and optimization"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

> Redesign only the landing page hero section of Courtroom AI. Make it visually striking, cinematic, premium, and memorable.
>
> Create a bold hero with large typography, dramatic visual hierarchy, and a compelling CTA. Keep the headline "Every case has two sides. Hear both argued." but elevate its presentation.
>
> Add a visually rich pixel-art courtroom scene featuring three distinct AI characters: Prosecution (blue), Defence (red), and Judge (gold). Use subtle animations, ambient lighting, character idle movements, and visual depth to make the courtroom feel alive. The scene should immediately communicate that three AIs debate and a judge decides the winner.
>
> Colour palette:
> - Background: `#101114`
> - Surface: `#1B1A20`
> - Text: `#E8DFCE`
> - Gold: `#C89B55`
> - Blue: `#628BFF`
> - Red: `#E16B64`
>
> Incorporate subtle grain, tasteful gradients, smooth motion, and interactive hover effects. Use 21st.dev components if useful, but avoid generic SaaS layouts, excessive glassmorphism, clutter, or unnecessary decoration.
>
> Make the hero responsive, especially on mobile. Preserve existing navigation, functionality, and routes. Inspect the current implementation and modify only the hero section. Make the changes directly and ensure they work.

## Before (optional: earlier, weaker version)

> 1. **Hero:** Create a cinematic, visually striking hero with bold typography, dramatic lighting, clear CTAs, and a memorable visual demonstrating the three AI agents. *(one line inside the bigger redesign prompt 013)*

## Why we changed it

- **This prompt was written by ChatGPT.** We sent it to Claude unchanged.
- In prompt 013 the hero was only one of four goals, and it came out as three characters standing on pedestals. This time the prompt is **scoped to one section** ("modify only the hero section") and says exactly what the visual must communicate ("three AIs debate and a judge decides the winner").

## Result

- **Headline:** the three lines rise out of a mask one after another. "two" is in the Prosecution's blue, "sides." in the Defence's red, and "argued." in the Judge's gold with a pixel underline that draws in.
- **Around the headline:** an eyebrow chip ("3 AI agents · 1 verdict"), a gold primary CTA, a secondary "Watch a sample hearing" CTA, and a "Free · no sign-up" line.
- **Lighting:** a warm light from above, three slow coloured beams and a vignette, on top of the site-wide film grain.
- **Layered pixel courtroom** (`components/landing/HeroCourt.tsx`) with **visual depth**:
  - **Back wall:** pillars, a moonlit window with twinkling stars and a light shaft, party banners and flickering lamps.
  - **Middle layer:** the bench and the Judge.
  - **Front layer:** the two lawyers at their desks.
  - **Closest layer:** gallery silhouettes and drifting dust.
  - The four layers move at different speeds with the mouse (parallax).
- **It shows what the app does in a short loop:**
  - The Prosecution argues FOR and the Defence AGAINST, each in their own spotlight with speech bubbles.
  - The Judge bangs the gavel and rules. Scores float up and the health bar below the scene shifts.
  - Desk tags read "Argues for", "Decides" and "Argues against".
- **Hover or tap a character:** the loop pauses and that agent explains its role. Keyboard users can do the same with Tab.
- **Mobile:** the headline wraps cleanly and the speech bubbles lean toward the centre so they stay inside the scene. No horizontal scroll at 375 px.
- **Bug found and fixed:** hovering a character could scroll the hero sideways, because the light beams overflow it. Switching from `overflow: hidden` to `overflow: clip` fixed it.
- **Unchanged:** the rest of the page, navigation and routes. Build, types and lint pass.

## What we learned

- **Scoping a prompt to one section** ("modify only the hero") gave a deeper result than asking for a whole-site redesign, where the hero was just one item in a list.
- Stating **what the visual must communicate** pushed the scene to tell the app's story (debate → ruling → score) instead of just decorating the page.
