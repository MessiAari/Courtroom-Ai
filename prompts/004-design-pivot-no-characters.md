---
id: "004"
title: "Design pivot: from cartoon characters to a cinematic emblem courtroom"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Prompt refinement and optimization", "Response evaluation", "Reverse prompting"]
date: "2026-11-20"
screenshot: ""
---

## Prompt (final version we sent)

> I want the site to look good. The SVG characters would not look good — SVG graphics are very basic.
>
> *(Claude suggested AI-generated portraits instead.)*
>
> Portraits won't look good either. Is the idea good?
>
> *(Claude evaluated the idea and proposed a cinematic, typographic courtroom with emblems instead of faces.)*
>
> Yes, build that.

## Before (optional: earlier, weaker version)

> **Original SVG characters** whose faces change with the `emotion` field. Do not copy any existing game, film or cartoon character.
> Speech bubble with a typewriter effect above the active speaker; the speaker glows or bounces.

## Why we changed it

- Hand-drawn SVG faces (and AI portraits) would have been the lowest-quality part of the site, and they aren't what the project is graded on.
- Instead of telling the AI what to draw, we asked it to **evaluate the idea itself** (reverse prompting). That brought out the real risk and a better alternative.

## Result

- Characters were replaced by three **gold-ringed emblems**: ⚖ Judge, sword for the Prosecution, shield for the Defence. Each has a nameplate, role colour, and spotlight halo on the active speaker.
- The AI's `emotion` field still drives the visuals: *confident* = glow pulse, *angry* = shake, *smug* = tilt, *shocked* = jolt, plus an emotion tag.
- Speech became a large serif "subtitle" panel with a typewriter effect and gold-highlighted evidence tags `[E1]`.
- Kept: credibility meter, OBJECTION splash + screen shake, gavel → stamp → score-bar verdict, voices, Ask the Judge.
- Mobile layout: all three seats in one row with one speech panel below.

## What we learned

- Asking "is the idea good?" made the AI judge its own suggestion instead of just executing it. The result was a design that is easier to make look premium and still uses the structured `emotion` output.
