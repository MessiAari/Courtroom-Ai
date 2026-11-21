---
id: "002"
title: "Initial project-building prompt (5 parts, v3)"
author: "Aaritra Kumar"
tool: "Claude"
techniques: ["Role-based", "Context-based", "Structured", "Clear instructions and constraints", "Step-by-step / chain"]
date: "2026-11-20"
screenshot: ""
---

## Prompt (final version we sent)

The course guidelines PDF was attached alongside this prompt so the AI knew the assessment rules.

````markdown
# Courtroom AI: Multi-Agent Debate Arena

## 1. ROLE
You are a senior full-stack developer, game UI designer and AI engineer. You build polished, animated Next.js apps, and you write clean, modular, well-commented code that a second-year engineering student can read and explain in a viva.

## 2. TASK
Build "Courtroom AI", a web app where three AI agents (a Prosecutor arguing FOR, a Defender arguing AGAINST, and a Judge) debate a case **on their own**, shown as an animated courtroom scene, not a chat log.

The user files a case (or picks one from a Case Library), watches the AIs argue through structured rounds, gets a verdict, and then questions the Judge through a chatbot.

## 3. CONTEXT
- **Problem:** People usually see only one side of an issue. College students struggle in placement Group Discussions (GDs), debates and interviews because they can't argue both sides or spot weak reasoning.
- **Target audience:** College students preparing for GD rounds; debate, MUN and moot-court participants; anyone weighing a real decision (e.g. "Job offer or higher studies?").
- **Value:** Users watch both sides argued well, see fallacies called out, and leave with GD-ready points.
- **Project setting:** This is a college Prompt Engineering final project. It must be deployed on Vercel, must include a working AI chatbot that talks to a real AI API, and must document the prompts used to build it.

### User flow
1. **Landing page:** cinematic courtroom hero with the three characters, a "File a case" CTA, a "How it works" section, and example cases.
2. **File a case:** type a topic or pick one from the Case Library; choose Quick or Full debate.
3. **Debate room:** the agents debate autonomously, round by round.
4. **Verdict:** animated verdict reveal with scores and GD takeaways.
5. **Ask the Judge:** chatbot with full context of the debate and verdict.
6. **How we built this:** page showing our prompt history.

## 4. CONSTRAINTS

### Tech stack
- Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React.
- Free tools and free API tiers only. No database, no paid services. Use localStorage only for optional debate history.
- Deploy on Vercel.

### AI providers (one per character)
| Character | Provider and model | Fallback if it fails |
|---|---|---|
| Prosecutor (FOR) | Groq: `openai/gpt-oss-120b` | Mistral (small free model) |
| Defender (AGAINST) | Groq: `openai/gpt-oss-120b` (same model, so the debate is fair) | Mistral (small free model) |
| Judge + Ask the Judge chatbot | Google Gemini: newest free Flash model | Groq `openai/gpt-oss-120b` |

- Both lawyers must always use the **same model**. Only their system prompts differ.
- Save tokens: send the transcript in compact form, and make the Judge score the whole round in one call rather than once per argument.

- All AI calls happen **only in server-side API routes**. Never expose keys to the browser.
- Model names and keys come from environment variables. Provide `.env.example`.
- Use a small provider abstraction (`lib/ai/provider.ts` plus one file per provider) so providers can be swapped.
- Each agent has its own system prompt, kept in `lib/ai/prompts.ts`, written with role, task, context, constraints and output format.
- Real API calls only. No fake or hard-coded AI responses.

### Debate structure
- Each turn sends the **full transcript so far**, so the agents respond to each other's actual points instead of writing unrelated paragraphs.
- **Quick debate (default):** Opening, then Rebuttal, then Verdict.
- **Full debate:** Opening, Rebuttal, Cross-examination (each side asks 1 question and the other answers), Closing, then Verdict.
- Keep each turn **under 100 words** so the debate stays watchable and we stay inside free-tier limits.
- If the case came from the Case Library, pass its facts to both lawyers as evidence and tell them to cite them.

### Structured output (drives the visuals)
Every lawyer turn must return valid JSON:
```json
{ "text": "...", "emotion": "neutral | confident | angry | smug | shocked" }
```
After each round, the Judge returns:
```json
{ "prosecutorScore": 0-10, "defenderScore": 0-10, "fallacy": null | { "by": "prosecutor | defender", "type": "strawman | ad hominem | ...", "quote": "..." } }
```
Final verdict JSON: winner, score out of 100 for each side, scores for reasoning, evidence, rebuttal and logic, key strengths and weaknesses, a neutral topic summary, and **3–5 "Key takeaways for your GD"**.
Validate and safely parse all JSON. If parsing fails, retry once, then fall back to plain text with a neutral emotion.

### Visual design (game scene, not a chat app)
- Dark charcoal background with gold/brass accents; cinematic but clean. Avoid generic SaaS templates.
- Courtroom layout: Judge at a raised bench in the centre top, Prosecutor on the left (red), Defender on the right (blue).
- **Original SVG characters** whose faces change with the `emotion` field. Do not copy any existing game, film or cartoon character.
- Speech bubble with a typewriter effect above the active speaker; the speaker glows or bounces.
- **Credibility meter:** a tug-of-war bar at the top that shifts after each Judge score.
- **"OBJECTION!" splash** with a short screen shake when the Judge detects a fallacy.
- **Voices:** different voice and pitch per character using the free browser Web Speech API, with a mute toggle (muted by default).
- **Verdict scene:** gavel animation, then a winner stamp, then score bars animating up, then a shareable verdict card.
- Round progress indicator, pause/resume, skip-to-verdict, restart, and a collapsible full transcript.
- Responsive: on mobile, stack the characters and show one speech bubble at a time instead of shrinking the desktop layout.

### Ask the Judge chatbot
- Opens after the verdict. The Judge has the full transcript and verdict as context.
- Suggested question chips, e.g. "Why did this side win?", "What was the weakest argument?", "Give me GD points", "How could the losing side win?"
- Chat history for the current debate, a loading indicator, clear chat, and retry on error.

### Case Library
- Cases live in `/data/cases/*.json`, each with `title`, `description` and `facts: [{ "fact": "...", "source": "..." }]`.
- Include 3 sample case files with placeholder facts; we will replace them with researched ones.

### Input validation and error handling
- Reject case input that is empty, under 10 characters, over 300 characters or obvious gibberish, with a themed message: "Case dismissed: …"
- On rate limit (HTTP 429), timeout, provider outage or a missing key:
  - Try the fallback provider first.
  - If that also fails, show "The court is in recess, try again in a minute" with a retry button.
  - Keep everything already generated; never crash or blank the page.
- If API keys aren't configured, show a clear setup screen explaining which env variables are missing.
- Never show raw error messages or stack traces to users.

### Prompt documentation (required by the project)
- Create a `/prompts` folder and a `PROMPTS.md` index table.
- Build a **"How we built this"** page that reads `/prompts` and shows each prompt as a card: number, title, author, tool (Claude / ChatGPT / Perplexity), technique, before/after prompt, result, and an optional screenshot.
- Create a `CLAUDE.md` telling future Claude sessions to log every new prompt in `/prompts` using the same template and to update `PROMPTS.md`.

### Out of scope for now
Do **not** build these yet: Practice Mode (user vs AI), PDF export, accounts, or a database. Keep the code structured so they can be added later.

## 5. OUTPUT FORMAT
1. **First response only:** give me a short plan, the complete folder structure, the list of pages and API routes, and the npm packages you'll use. Then **stop and wait for my approval.**
2. After I approve, build in this order, and finish each step with a one-line summary of what now works:
   1. Project setup, theme and landing page
   2. Courtroom scene and characters, using sample data
   3. Provider layer and API routes for the three agents
   4. Debate engine (rounds, transcript passing, JSON parsing, meter, objection)
   5. Verdict scene
   6. Ask the Judge chatbot
   7. Case Library
   8. Error handling and the setup screen
   9. "How we built this" page and prompt logging
   10. Voices and final animation polish
3. Add short comments explaining every important function, especially the debate loop and the API calls.
4. Make sure `npm run build` passes with no TypeScript errors.
5. Finish with a `README.md` covering the project description, problem and audience, features, tech stack, AI tools used, how the three agents interact, how to get free Gemini, Groq and Mistral API keys, setup and run commands, Vercel deployment, and troubleshooting.
````

## Before (optional: earlier, weaker version)

> **v2, written by ChatGPT (prompt 001):** "# Project: AI Courtroom – Multi-Agent Debate Platform … You are a senior full-stack developer, UI/UX designer, and AI engineer. Build a complete, functional, visually polished web application … Start by building the complete project. Do not stop at planning or asking me questions." About 350 lines; full text in [outputs/001-chatgpt-v2.md](outputs/001-chatgpt-v2.md).

## Why we changed it

We edited ChatGPT's v2 by hand into this v3:

- **Plan first, then wait.** v2 said "do not stop at planning or asking me questions". We reversed that so we could review the architecture before any code, then build in 10 ordered steps.
- **One model per character.** v2 said "optional: choose AI provider". v3 has a table: both lawyers on the same Groq model (so the debate is fair), the Judge on Gemini, each with a fallback.
- **Structured JSON outputs.** We added exact JSON shapes for lawyer turns, round scores and the verdict, so the visuals (emotion, credibility meter, OBJECTION) are driven by data.
- **Limits.** Turns under 100 words, a compact transcript and one Judge call per round, to stay inside free tiers.
- **Our own features.** Case Library with cited facts, "Case dismissed" input validation, "court is in recess" errors, and the "How we built this" page with prompt logging.
- **Cut scope.** v2's long "if time permits" list became an explicit "out of scope for now" list (Practice Mode, PDF export, accounts, database).
- **Context.** Added the real problem, target audience and project rules (Vercel, a working chatbot, documented prompts).

## How the five parts map

| Part | What it gave the AI | Effect on the output |
|---|---|---|
| **Role** | Senior full-stack dev + game UI designer + AI engineer, writing viva-friendly code | Plan favours readable modules, plain `fetch` over extra SDKs, commented debate loop |
| **Task** | Three autonomous AI agents debating in an animated courtroom | Plan centres on a scene, not a chat log |
| **Context** | GD / debate / moot-court students; college project rules | Verdict includes "GD takeaways"; a "How we built this" page is planned |
| **Constraints** | Providers + fallbacks, JSON schemas, <100-word turns, free tiers, error rules | Provider abstraction, zod validation, retry-then-fallback parsing, recess screen |
| **Output format** | Plan first, then 10 ordered build steps | AI stopped after the plan and waited for approval |

## Result

The AI replied with a plan only, as instructed. Full reply saved in [outputs/002-plan.md](outputs/002-plan.md).

- Proposed a **client-driven debate loop**: the browser calls one API route per turn, so each Vercel call stays short and pause / skip / retry are easy.
- **Provider layer**: one `generate()` function per provider plus a `withFallback()` chain that switches on 429, timeout, 5xx or missing key.
- Counted the API cost up front: **7 calls** for a Quick debate, **15** for a Full one.
- Listed 5 pages, 6 API routes and a small package list (`framer-motion`, `lucide-react`, `@google/genai`, `zod`, `gray-matter`).

## What we learned

- Asking for "plan first, then stop" (Output Format) gave us a checkpoint to review the architecture before any code was written.
- Putting exact JSON schemas in the prompt made the AI design the visuals (faces, meter, objection splash) around the data instead of guessing.
