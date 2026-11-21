---
id: "010"
title: "Make the pixel style our own: Jade bench palette"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Response evaluation", "Prompt refinement and optimization", "Clear instructions and constraints", "Step-by-step / chain"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

> The redesign looks lively but it's too close to Mistral's actual brand. It uses their exact orange/yellow colours, and the pixel blocks in those colours make it look copied. I want to keep the pixel style but make it our own.
>
> - Replace the orange/yellow palette with our own colours (suggest 2–3 options first, nothing orange or yellow). Keep red for Prosecution and blue for Defence.
> - Keep the pixel style, but make it courtroom-themed: pixel gavel, pixel verdict stamp, pixel sword and shield, and a pixel health-bar style credibility meter. Think retro court game, not Mistral.
> - Keep the layout, fonts, animations, copy and all features as they are.
>
> Show me the 2–3 palette options first, then wait for my pick.
>
> *(After seeing the options:)* Jade bench.

## Before (optional: earlier, weaker version)

> Use Mistral.ai as inspiration for its bold typography, vibrant colours, clean layouts… *(prompt 009)*

## Why we changed it

- We evaluated the output of 007 and found it borrowed Mistral's actual brand colours and stepped-block motif.
- Asking for **options first, then waiting** (a chain step) kept the decision with us instead of the AI picking.

## Result

- Claude proposed three palettes as a visual comparison: **Royal violet**, **Jade bench** and **Ivory and ink**. We chose **Jade bench**: the clearest three-way split between red, jade and blue, and the furthest from Mistral.
- New tokens: jade ramp for the Judge and accents, true red `#E5484D` for the Prosecution, blue `#3E8BFF` for the Defence. Error states stay red.
- Courtroom pixel props: steel-and-red **sword**, blue **shield**, ivory **gavel** with a jade block, a **rubber verdict stamp** that presses onto the judgment, and pixel **hearts**.
- The credibility meter became a **fighting-game health bar**: both sides start full, the trailing side loses blocks as the Judge scores rounds, with "VS" in the middle.
- Layout, fonts, animations, copy and features unchanged; re-tested on desktop and mobile with real debates.

## What we learned

- "Keep X, change Y" is a very effective constraint pattern. It stopped the AI from redesigning things we already liked.
