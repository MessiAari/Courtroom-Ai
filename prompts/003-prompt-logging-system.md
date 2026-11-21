---
id: "003"
title: "Set up a prompt log for the whole team"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Context-based", "Prompt refinement and optimization"]
date: "2026-11-20"
screenshot: ""
---

## Prompt (final version we sent)

> So I am saving the prompts I am giving to the other AI. You have to maintain a md file for the prompts, a way to show our prompts. Now whatever prompts I give to you, save them too, whatever is presentable. My teammates are Tanushree and Rounak.

## Why we sent it

- The guidelines want prompts from **at least three AI tools** documented, plus "before vs after" refinements. We needed one place where all three of us (Aaritra, Tanushree, Rounak) log prompts from Claude, ChatGPT, Perplexity, etc. in the same format.

## Result

- Created `/prompts` with one Markdown file per prompt and a shared [`_TEMPLATE.md`](_TEMPLATE.md) (id, title, author, tool, techniques, date, screenshot, prompt, before, result, lessons).
- Created [`PROMPTS.md`](../PROMPTS.md): an index table of every prompt plus a short "how to add yours" guide for teammates.
- Saved prompt 002 and its full output ([outputs/002-plan.md](outputs/002-plan.md)).
- Added a rule in `CLAUDE.md` so every future prompt to Claude gets logged automatically, with casual wording tidied up for presentation.
- These same files will feed the "How we built this" page, so the website and the repo show the same prompt history.

## What we learned

- Giving the AI the team context (names, other tools in use) let it design a log that works for everyone, not just for the Claude prompts.
