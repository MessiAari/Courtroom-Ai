# ⚖️ Courtroom AI — Multi-Agent Debate Arena

Three AI agents argue your case **on their own**: a **Prosecutor** argues FOR, a **Defender** argues AGAINST, and a **Judge** scores every round, calls out logical fallacies with an **OBJECTION!**, delivers a verdict, and then answers your questions.

**Live site:** _add the Vercel URL after deploying_
**Team:** Aaritra Kumar · Tanushree · Rounak — Prompt Engineering final project (3rd semester)

---

## The problem and who it's for

People usually see only one side of an issue. College students struggle in placement **Group Discussions (GDs)**, debates and interviews because they can't argue both sides or spot weak reasoning.

**Audience:** students preparing for GD rounds; debate, MUN and moot-court participants; anyone weighing a real decision ("Job offer or higher studies?").

**What they get:** both sides argued well, fallacies called out, a neutral summary, and 3–5 GD-ready takeaways.

## Features

| Area | What it does |
|---|---|
| **Landing page** | Editorial hero with a sample court record, "How a hearing works", the three parties, cases on the docket |
| **File a case** | Type any topic or pick from the **Case Library**; choose **Quick** (Opening → Rebuttal → Verdict) or **Full** (+ Cross-examination + Closing) |
| **Hearing (debate room)** | Agents debate autonomously, round by round, as a numbered **live court record**. Each statement types itself out; a sticky docket bar shows who is speaking / preparing and the AI's `emotion` |
| **Credibility scale** | Hairline tug-of-war scale that shifts after each Judge score |
| **Objection** | Full-width red band + small shake when the Judge detects a fallacy (the quote is verified against the transcript first) |
| **Controls** | Round progress, pause/resume, skip to judgment, restart, collapsible record ("show current only" — the default on phones) |
| **Voices** | Different voice and pitch per character via the free browser Web Speech API (muted by default) |
| **Judgment** | Presented like a printed judgment: gavel → "The court finds for…" + stamp → schedule of scores (overall + reasoning/evidence/rebuttal/logic) → findings, neutral summary, GD points, shareable card |
| **Ask the Judge** | Chatbot with the full transcript + verdict as context; suggested-question chips, history, loading state, clear chat, retry on error |
| **How we built this** | Reads our `/prompts` folder and shows every prompt as a card (author, tool, techniques, before/after, result) |
| **Error handling** | Input validation ("Case dismissed: …"), provider fallback, "The court is in recess" + Retry, setup screen when keys are missing, no raw errors shown |
| **History** | Last 8 verdicts saved in localStorage (optional) |
| **Responsive** | Single-column record on phones with a compact sticky docket; no horizontal scroll; respects `prefers-reduced-motion` |

## Tech stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Framer Motion** (animation), **Lucide React** (icons)
- Type: **Instrument Serif** (statements), **Geist** (UI), **Geist Mono** (docket metadata)
- **zod** (validating AI JSON), **gray-matter** + **react-markdown** (prompt log page)
- **@google/genai** for Gemini; Groq and Mistral are called with plain `fetch` (both use the OpenAI-style chat API)
- Hosted on **Vercel**. No database — localStorage only.

## AI models (one per character)

| Character | Main model | Fallback |
|---|---|---|
| Prosecutor (FOR) | Groq `openai/gpt-oss-120b` | Mistral `mistral-small-latest` |
| Defender (AGAINST) | Groq `openai/gpt-oss-120b` (same model = fair fight) | Mistral `mistral-small-latest` |
| Judge + Ask the Judge | Google Gemini Flash (`GEMINI_MODEL`) | Groq `openai/gpt-oss-120b` |

## How the three agents interact

```
Browser (useDebate.ts — the debate loop)
  │  for each step in the plan:
  │    POST /api/debate/turn    { topic, caseId, transcript, step }  → Prosecutor or Defender
  │    POST /api/debate/judge   { topic, transcript, phase }         → Judge scores the round
  │    POST /api/debate/verdict { topic, transcript, scores }        → final verdict
  ▼
API route (server only — keys never reach the browser)
  │  builds the system prompt (lib/ai/prompts.ts) + compact transcript
  │  generateWithFallback([main, fallback])   ← lib/ai/provider.ts
  ▼
Groq / Mistral / Gemini  →  JSON  →  zod validation (retry once, then plain-text fallback)
```

1. The browser walks through the **round plan** (`lib/debate/rounds.ts`). Quick = 7 AI calls, Full = 15.
2. Every lawyer turn receives the **full transcript so far** (in a compact `[Opening] FOR: …` format to save tokens), so they rebut each other's real points.
3. After both lawyers speak, the Judge scores the **whole round in one call** and may flag one fallacy.
4. Lawyers reply with `{ "text", "emotion" }`; the emotion drives the emblem animation. The Judge replies with `{ prosecutorScore, defenderScore, fallacy }`.
5. The verdict JSON drives the verdict scene. **Ask the Judge** sends the transcript + verdict + chat history to `/api/judge-chat`.
6. Every system prompt follows the five-part structure: **Role, Task, Context, Constraints, Output format** — see `lib/ai/prompts.ts`.

### Error handling path
- Provider fails (429 rate limit, timeout, outage, bad key) → next provider in the chain.
- All providers fail → API returns `{ error: "recess" }` → UI shows **"The court is in recess"** with **Retry**; everything generated so far is kept.
- No keys configured → **setup screen** listing which env variables are missing.
- AI returns broken JSON → retry once with a reminder → otherwise plain text with a neutral emotion.

## Getting free API keys

| Key | Where | Notes |
|---|---|---|
| `GROQ_API_KEY` | https://console.groq.com/keys | Free tier; sign in with Google/GitHub. **Minimum needed** — Groq can play all three roles. |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey | Free tier for Flash models. Used by the Judge. |
| `MISTRAL_API_KEY` | https://console.mistral.ai/api-keys | Choose the free "Experiment" plan (phone verification). Optional backup for the lawyers. |

## Setup and run

```bash
npm install
cp .env.example .env.local   # then paste your keys into .env.local
npm run dev                  # http://localhost:3000
```

Other commands: `npm run build` (production build + type check), `npm run lint`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo (framework preset: Next.js).
3. **Settings → Environment Variables:** add `GROQ_API_KEY`, `GEMINI_API_KEY`, `MISTRAL_API_KEY` (and optionally the `*_MODEL` overrides from `.env.example`).
4. Deploy. If you add keys later, **Redeploy** so they take effect.
5. Test on the live URL: file a case, watch a Quick debate, open the verdict, ask the Judge a question, and check mobile.

## Project structure

```
app/                     pages + API routes
  api/debate/turn|judge|verdict, api/judge-chat
  courtroom/  file/  how-we-built-this/  setup/
components/
  courtroom/             Courtroom (hearing), Record (live entries + typewriter), Docket (scale, roster, controls, objection)
  verdict/Judgment  chat/AskTheJudge  landing/  prompts/
lib/
  ai/                    provider.ts, groq.ts, mistral.ts, gemini.ts, prompts.ts, schemas.ts, parse.ts, agents.ts
  debate/                rounds.ts, transcript.ts, useDebate.ts (the debate loop)
  validation.ts, cases.ts, speech.ts, history.ts, env.ts
data/cases/*.json        Case Library
prompts/  PROMPTS.md     our prompt history (shown on /how-we-built-this)
```

## AI tools used to build it

See [`PROMPTS.md`](PROMPTS.md) for every prompt, which tool it went to, and how it was refined. Summary:

- **Claude (Claude Code):** architecture plan, all application code, agent prompts, prompt log.
- **Perplexity:** researched facts and sources for the Case Library _(to be added)_.
- **ChatGPT / Gemini:** _(to be added by the team)_.

## Troubleshooting

| Problem | Fix |
|---|---|
| Setup screen appears | A required key is missing. Add it to `.env.local` (local) or Vercel env vars, then restart / redeploy. |
| "The court is in recess" | All providers failed — usually a free-tier rate limit (429). Wait a minute and press Retry. Adding `MISTRAL_API_KEY` gives the lawyers a backup. |
| Judge seems slow | Gemini can be busy; the Judge automatically falls back to Groq. You can also set `GEMINI_MODEL` to another Flash model. |
| No voices | Click **Voices on** (muted by default). Some browsers have only one voice, so characters differ by pitch only. |
| Lawyers cite `[E1]` etc. | That's evidence from a Case Library file. Placeholder facts are never sent to the AI. |
| Build fails on fonts | `next/font` downloads Google Fonts at build time; make sure you're online. |

## Out of scope (planned)
Practice Mode (user vs AI), PDF export, accounts and a database. The code is modular (provider layer, round plan, debate hook) so these can be added later.
