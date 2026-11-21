---
id: "011"
title: "Research report: GD problem, debate formats, rubric and fallacies"
author: "Aaritra Kumar"
tool: "Perplexity"
techniques: ["Role-based", "Context-based", "Structured", "Clear instructions and constraints"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

````markdown
ROLE: You are a research analyst helping college students build an AI debate
platform called "Courtroom AI".

TASK: Research the following and give me a fact-based report with sources:
1. The problem: why students struggle in placement group discussions (GDs)
   and debates, and evidence that people mostly see one side of issues
   (echo chambers, confirmation bias). Include statistics where possible.
2. Debate formats: how competitive debates and moot courts structure rounds
   (opening, rebuttal, cross-examination, closing), and how judges score
   them.
3. A judging rubric: the criteria judges use (reasoning, evidence, rebuttal,
   logic, persuasiveness) and how each is usually weighted.
4. The 10 most common logical fallacies in debates, each with a one-line
   definition and a short example.
5. Existing AI debate tools or apps: what they do, and what they're missing.

CONTEXT: The app has two AI lawyers that debate a topic on their own over
3–5 rounds, and an AI judge that scores each round, flags fallacies and gives
a verdict. The target users are Indian college students preparing for GD
rounds in placements. This research will shape the debate structure, the
judge's scoring rubric and our project presentation.

CONSTRAINTS:
- Use reliable sources (research papers, education sites, debate
  organisations). Avoid forums.
- Cite a source for every statistic.
- Keep it concise and practical: no filler.

OUTPUT FORMAT: Five sections with clear headings matching the five points
above. Use a table for the fallacies and the rubric. End with a 5-bullet
summary of "What this means for our app".
````

## Result

The full report is saved in [`docs/research-report.md`](../docs/research-report.md). Highlights:

- **The problem:** in 2026 campus-hiring research, 68% of students considered themselves job-ready but only 9% of employers agreed. Confirmation bias and selective exposure explain why students prepare only one side.
- **Debate formats:** WSDC (constructive → rebuttal → points of information → reply) and moot court (submissions → judge questions → rebuttal) both map onto our Opening → Rebuttal → Cross-examination → Closing rounds.
- **Judging rubric:** WSDC scores content 40 / style 40 / strategy 20. The report suggests reasoning 25, evidence 20, rebuttal 20, persuasiveness 15, strategy 10, logical discipline 10.
- **Fallacies:** ten common, detectable fallacies with one-line definitions and examples.
- **Gap in existing tools:** IBM Project Debater and GPT-4 persuasion studies show AI can debate, but none offer placement-focused, round-by-round, fallacy-aware judging.

### How Claude used it in the app

- Added the report's missing fallacies (appeal to popularity, post hoc, hasty generalisation) to the Judge's list.
- Rebuttals now start by fairly restating the opponent's strongest point ("steel-man") before answering, as the report recommends against straw-manning.
- The problem statistics and the "gap in existing tools" feed our presentation and README.

## What we learned

- Giving Perplexity our app's design in the **Context** ("two AI lawyers … 3–5 rounds … a judge that scores each round") made the research come back already mapped onto our features, instead of a general essay on debating.
- Asking for **tables** and a final "What this means for our app" summary made the report quick to act on.
