---
id: "008"
title: "Critique our rough redesign prompt with ChatGPT"
author: "Aaritra Kumar"
tool: "ChatGPT"
techniques: ["Response evaluation", "Prompt refinement and optimization", "Clear instructions and constraints"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

> Here's my rough prompt for Claude Code to redesign the Courtroom AI site:
>
> """
> The site looks too dull. Make it lively. Use mistral.ai as reference for the theme and use components from 21st.dev. Don't break anything that already works. Make it look good on mobile too.
> """
>
> Critique it using the five parts of a good prompt (role, task, context, constraints, output format). Tell me what's missing or vague, then rewrite it as an improved prompt. Keep the rewritten prompt short and to the point, under 200 words, since Claude Code already knows the project.

## Why we sent it

- Our rough redesign prompt only said "dull → lively" and named two websites. Before sending it to Claude, we wanted an outside check against the five-part structure from class.
- This time we asked for a **critique first, then a rewrite**, with a **200-word limit**. For prompt 001, ChatGPT's unlimited rewrite came back at ~350 lines and needed heavy editing.

## Result

- ChatGPT pointed out that the rough prompt had no role, a vague task ("lively"), no output or execution steps, and only one constraint ("don't break anything").
- Its rewrite (sent to Claude as prompt 009) added:
  - a **role** (senior UI/UX designer and frontend developer);
  - a **visual direction** (what to take from Mistral.ai: typography, colour, hierarchy, animation);
  - explicit **constraints** (keep every feature, route and API; mobile; accessibility; performance);
  - an **execution order** (inspect → implement → test → fix → build).
- We sent the rewrite to Claude without changes.

## What we learned

- Asking for a critique against a named framework (the five parts) gave a specific list of gaps instead of generic "make it better" advice.
- Setting a word limit on the rewrite kept it focused. This time we didn't need to edit it.
