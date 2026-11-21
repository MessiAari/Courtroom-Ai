---
id: "009"
title: "Research report: GD problem, debate formats, rubric, fallacies and case library"
author: "TBD"
tool: "Perplexity"
techniques: ["Context-based", "Structured", "Clear instructions and constraints"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

> _To be added: paste the exact prompt we gave Perplexity here._

## Result

The full report is saved in [`docs/research-report.md`](../docs/research-report.md). Highlights:

- **The problem:** in 2026 campus-hiring research, 68% of students considered themselves job-ready but only 9% of employers agreed; confirmation bias and selective exposure explain why students prepare only one side.
- **Debate formats:** WSDC (constructive → rebuttal → points of information → reply) and moot court (submissions → judge questions → rebuttal) both map onto our Opening → Rebuttal → Cross-examination → Closing rounds.
- **Judging rubric:** WSDC scores content 40 / style 40 / strategy 20; the report suggests reasoning 25, evidence 20, rebuttal 20, persuasiveness 15, strategy 10, logical discipline 10.
- **Fallacies:** ten common, detectable fallacies with one-line definitions and examples.
- **Gap in existing tools:** IBM Project Debater and GPT-4 persuasion studies show AI can debate, but none offer placement-focused, round-by-round, fallacy-aware judging.
- **Case library:** 8 researched cases, each with 3 facts for and 3 against, with sources.

### How Claude used it in the app

- Replaced the 3 placeholder cases with the **8 researched cases** in `data/cases/`. Each fact keeps its FOR/AGAINST tag, and the lawyers' prompt tells each side to prefer its own evidence ([E1]–[E6]).
- Added the report's missing fallacies (appeal to popularity, post hoc, hasty generalisation) to the Judge's list.
- Rebuttals now start by fairly restating the opponent's strongest point ("steel-man") before answering, as the report recommends against straw-manning.
- Tested live: the Prosecution cited [E1]–[E3], the Defence [E4]–[E6], and the rebuttal restated the Defence's point first.

## What we learned

- Asking for a fixed JSON shape (`id`, `title`, `description`, `facts[{side, fact, source}]`) meant the research could be imported straight into the app with no retyping.
- Some facts cite only a homepage (e.g. ugc.gov.in, rbi.org.in, itdp.org) rather than the exact page, and a few are opinions rather than facts. These should be tightened before the final submission.
