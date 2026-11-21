# Output of prompt 002: Claude's plan (verbatim, lightly trimmed)

> Saved because the course guidelines ask us to keep "the original prompt and the output generated from it".

## Plan

- **The debate runs from the browser, one AI call at a time.** A hook in the browser calls a server route for each turn and keeps the full transcript in its state. That keeps every server call short and well inside Vercel's time limits. It also makes pause, resume, skip-to-verdict and "keep what's already generated" easy, because nothing is lost if one call fails.
- **Each AI provider is swappable.** Every provider has one function: `generate({ system, messages, json }) → text`. A chain function tries the main provider first, then the fallback. It moves to the fallback on a 429 (rate limit), a timeout, a 5xx error or a missing key.
- **The transcript is sent in a short form**, like `P1: …`, `D1: …`, to save tokens. The Judge scores each whole round in one call.
- **All AI replies are checked before use** with zod. If a reply isn't valid JSON, it retries once, then falls back to plain text with a neutral face.

**Number of AI calls per debate:**

| Debate | Calls | Breakdown |
|---|---|---|
| Quick | 7 | (2 lawyer turns + 1 Judge score) × 2 rounds, plus the verdict |
| Full | 15 | Opening 3, Rebuttal 3, Cross-examination 5 (2 questions, 2 answers, 1 Judge score), Closing 3, plus the verdict |

## Folder structure

```
courtroom-ai/
├─ app/
│  ├─ layout.tsx, globals.css, page.tsx        # landing: hero, how it works, example cases
│  ├─ file/page.tsx                            # file a case + Case Library picker + Quick/Full
│  ├─ courtroom/page.tsx                       # debate room → verdict → Ask the Judge
│  ├─ how-we-built-this/page.tsx               # reads /prompts at build time
│  ├─ setup/page.tsx                           # missing-env-vars screen
│  └─ api/
│     ├─ debate/turn/route.ts                  # one lawyer turn (Groq → Mistral)
│     ├─ debate/judge/route.ts                 # score one round (Gemini → Groq)
│     ├─ debate/verdict/route.ts               # final verdict (Gemini → Groq)
│     ├─ judge-chat/route.ts                   # Ask the Judge chatbot (Gemini → Groq)
│     ├─ cases/route.ts                        # lists Case Library
│     └─ health/route.ts                       # which keys are set (true/false only, never values)
├─ components/
│  ├─ landing/      Hero, HowItWorks, ExampleCases
│  ├─ courtroom/    CourtroomScene, SpeechBubble (typewriter), CredibilityMeter,
│  │                ObjectionSplash, RoundProgress, Controls, TranscriptDrawer, MobileStage
│  ├─ characters/   Judge.tsx, Prosecutor.tsx, Defender.tsx, faces.tsx  # original SVG, 5 emotions
│  ├─ verdict/      GavelAnimation, WinnerStamp, ScoreBars, VerdictCard (share/copy)
│  ├─ chat/         AskTheJudge, ChatMessage, SuggestionChips
│  ├─ prompts/      PromptCard
│  └─ ui/           Button, Recess (retry), CaseDismissed, MuteToggle
├─ lib/
│  ├─ ai/           provider.ts, groq.ts, mistral.ts, gemini.ts, prompts.ts, schemas.ts, parse.ts
│  ├─ debate/       rounds.ts, transcript.ts, useDebate.ts (the debate loop)
│  ├─ validation.ts, cases.ts, env.ts, speech.ts, history.ts
├─ data/cases/      3 sample cases
├─ prompts/         one .md per prompt
├─ PROMPTS.md, CLAUDE.md, README.md, .env.example
```

## Pages and API routes

| Pages | API routes |
|---|---|
| `/` landing | `POST /api/debate/turn` |
| `/file` file a case | `POST /api/debate/judge` |
| `/courtroom` debate, verdict and chat | `POST /api/debate/verdict` |
| `/how-we-built-this` | `POST /api/judge-chat` |
| `/setup` | `GET /api/cases`, `GET /api/health` |

## npm packages

- **Base:** `next`, `react`, `react-dom`, `typescript`, `tailwindcss`
- **Animation and icons:** `framer-motion`, `lucide-react`
- **AI:** `@google/genai` for Gemini; Groq and Mistral via plain `fetch` (fewer dependencies, easier to explain)
- **Data:** `zod` (checking AI replies), `gray-matter` (reading prompt files)
- **Fonts:** `next/font`
- No database; voices use the browser's free Web Speech API.
