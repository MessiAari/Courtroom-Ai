---
id: "001"
title: "Rough first prompt, improved with ChatGPT"
author: "Aaritra Kumar"
tool: "ChatGPT"
techniques: ["Prompt refinement and optimization", "Reverse prompting", "Structured"]
date: "2026-11-20"
screenshot: ""
---

## Prompt (final version we sent)

We wrote a short five-part prompt ourselves, then asked ChatGPT to improve it before giving it to Claude.

````markdown
ROLE: You are a web developer.

TASK: Make a website where 3 AIs debate a topic. One argues for, one argues
against, and one is the judge who decides who wins.

CONTEXT: It's for students who want to practise for group discussions and
see both sides of an argument. It's my college prompt engineering project.

CONSTRAINTS: Use Next.js and free AI APIs (Gemini, Groq, Mistral). It should
look like a courtroom with animations, and have a chatbot where users can
ask the judge questions. Handle errors.

OUTPUT FORMAT: Give me the full code and the steps to run it.

Improve this prompt so Claude understands it better and builds the website.
````

## Why we sent it

- Our rough draft (**v1**, the five-part block above) had all five parts, but each one was a single vague line: "a web developer", "look like a courtroom with animations", "handle errors", "give me the full code".
- Every part of v1 left the big decisions to the AI: which model plays which role, how many rounds, what the Judge scores, what "handle errors" means.
- Instead of guessing the missing details ourselves, we asked another AI to expand the prompt (reverse prompting: let the AI write the prompt).

## Result

ChatGPT returned **v2**, a ~350-line spec (full text in [outputs/001-chatgpt-v2.md](outputs/001-chatgpt-v2.md)):

- A much stronger role: "senior full-stack developer, UI/UX designer, and AI engineer".
- Five named debate rounds (Opening, Rebuttals, Cross-examination, Closing, Verdict) plus Quick vs Full mode.
- A verdict rubric: score out of 100, reasoning, evidence, rebuttal, logic, persuasiveness, strengths and weaknesses.
- A Judge chatbot with suggested questions, a provider abstraction with fallback, and a full error-handling list.
- A cinematic dark-and-gold courtroom look, a list of 10 deliverables, and a priority order.

We didn't send v2 as it was. We edited it into **v3**, the prompt we gave Claude (prompt 002).

## What we learned

- A five-part structure is only as good as the detail inside each part. ChatGPT filled in the detail, but it also added things we didn't want (build everything at once, no questions, lots of extras), so its output still needed a human edit.
