# Prompt Log — Courtroom AI

Team: **Aaritra Kumar**, **Tanushree**, **Rounak**
Every prompt we used to build this project, across all AI tools. Each row links to a full card in [`/prompts`](prompts/) with the exact prompt, the earlier version (if refined), the result and what we learned. The same files power the website's **How we built this** page.

## Index

| # | Title | Author | Tool | Techniques | Date |
|---|---|---|---|---|---|
| [001](prompts/001-chatgpt-improve-first-prompt.md) | Rough first prompt, improved with ChatGPT | Tanushree | ChatGPT | Refinement, Reverse prompting, Structured | 2026-11-20 |
| [002](prompts/002-initial-project-prompt.md) | Initial project-building prompt (5 parts, v3) | Aaritra Kumar | Claude | Role-based, Context-based, Structured, Constraints, Chain | 2026-11-20 |
| [003](prompts/003-prompt-logging-system.md) | Set up a prompt log for the whole team | Aaritra Kumar | Claude | Context-based, Refinement | 2026-11-20 |
| [004](prompts/004-approve-plan-and-build.md) | Approve the plan and build the app | Aaritra Kumar | Claude | Step-by-step / chain | 2026-11-20 |
| [005](prompts/005-design-pivot-no-characters.md) | Design pivot: cartoon characters → emblem courtroom | Aaritra Kumar | Claude | Refinement, Response evaluation, Reverse prompting | 2026-11-20 |
| [006](prompts/006-professional-redesign.md) | Redesign: make it look designer-made, not AI-made | Aaritra Kumar | Claude | Response evaluation, Refinement, Constraints | 2026-11-20 |
| [007](prompts/007-real-api-testing.md) | Test with real API keys (and the Gemini bug it found) | Aaritra Kumar | Claude | Response evaluation, Chain | 2026-11-21 |
| [008](prompts/008-chatgpt-critique-redesign-prompt.md) | Critique our rough redesign prompt with ChatGPT | Tanushree | ChatGPT | Response evaluation, Refinement, Constraints | 2026-11-21 |
| [009](prompts/009-mistral-inspired-redesign.md) | Redesign: visually striking, modern and interactive | Aaritra Kumar | Claude | Role-based, Context-based, Structured, Constraints, Chain | 2026-11-21 |
| [010](prompts/010-jade-bench-palette.md) | Make the pixel style our own: Jade bench palette | Aaritra Kumar | Claude | Response evaluation, Refinement, Constraints, Chain | 2026-11-21 |
| [011](prompts/011-perplexity-research-report.md) | Research report: GD problem, formats, rubric, fallacies | Rounak | Perplexity | Role-based, Context-based, Structured, Constraints | 2026-11-21 |
| [012](prompts/012-perplexity-case-library.md) | Case Library: 8 cases with sourced facts for and against | Rounak | Perplexity | Role-based, Context-based, Structured, Constraints | 2026-11-21 |
| [013](prompts/013-chatgpt-gilded-redesign.md) | Redesign brief written by ChatGPT: hero, sample hearing, pixel-art courtroom | Tanushree | Claude (prompt written by ChatGPT) | Structured, Constraints, Context-based, Refinement | 2026-11-21 |
| [014](prompts/014-chatgpt-hero-courtroom.md) | Hero-only brief written by ChatGPT: a living pixel courtroom | Tanushree | Claude (prompt written by ChatGPT) | Structured, Constraints, Refinement | 2026-11-21 |
| [015](prompts/015-chatgpt-security-hardening.md) | Security audit and hardening brief written by ChatGPT | Tanushree | Claude (prompt written by ChatGPT) | Structured, Chain, Constraints, Response evaluation | 2026-11-21 |

## AI tools used (guideline 2.3: at least three)

| Tool | Used by | What it did for the project |
|---|---|---|
| Claude (Claude Code) | Aaritra | Architecture plan, all app code, agent system prompts, two design iterations, prompt log |
| ChatGPT | Tanushree | Turned our rough first prompt into a detailed spec (001), which we edited into the build prompt (002); critiqued and rewrote our redesign prompt (008); wrote the pixel-art courtroom redesign brief (013) the hero brief (014) and the security brief (015) |
| Perplexity | Rounak | Research report (011) ([docs/research-report.md](docs/research-report.md)): the GD problem, debate formats, judging rubric, fallacies, and the 8-case library with sourced facts for and against (012) |

## Prompt-engineering techniques (guideline 2.4)

Use these exact names in the `techniques` field so the website can filter by them:
`Role-based` · `Step-by-step / chain` · `Context-based` · `Structured` · `Prompt refinement and optimization` · `Clear instructions and constraints` · `Reverse prompting` · `Response evaluation`

## How to add your prompt (Tanushree, Rounak)

1. Copy [`prompts/_TEMPLATE.md`](prompts/_TEMPLATE.md) to `prompts/NNN-short-title.md` using the next free number.
2. Fill in the top section (author, tool, techniques, date) and paste the exact prompt.
3. If you improved a prompt, put the old one under **Before** and explain what changed. Graders want to see that refinement.
4. Optional: save a screenshot in `public/prompts/NNN-*.png` and set `screenshot:` to `/prompts/NNN-*.png`.
5. Add a row to the **Index** table above.

Or just send the prompt and its result to Aaritra, and Claude will log it in this format.
