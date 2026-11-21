# Prompt Log — Courtroom AI

Team: **Aaritra Kumar**, **Tanushree**, **Rounak**
Every prompt we used to build this project, across all AI tools. Each row links to a full card in [`/prompts`](prompts/) with the exact prompt, the earlier version (if refined), the result and what we learned. The same files power the website's **How we built this** page.

## Index

| # | Title | Author | Tool | Techniques | Date |
|---|---|---|---|---|---|
| [001](prompts/001-initial-project-prompt.md) | Initial project-building prompt (5 parts) | Aaritra Kumar | Claude | Role-based, Context-based, Structured, Constraints, Chain | 2026-11-20 |
| [002](prompts/002-prompt-logging-system.md) | Set up a prompt log for the whole team | Aaritra Kumar | Claude | Context-based, Refinement | 2026-11-20 |
| [003](prompts/003-approve-plan-and-build.md) | Approve the plan and build the app | Aaritra Kumar | Claude | Step-by-step / chain | 2026-11-20 |
| [004](prompts/004-design-pivot-no-characters.md) | Design pivot: cartoon characters → emblem courtroom | Aaritra Kumar | Claude | Refinement, Response evaluation, Reverse prompting | 2026-11-20 |
| [005](prompts/005-professional-redesign.md) | Redesign: make it look designer-made, not AI-made | Aaritra Kumar | Claude | Response evaluation, Refinement, Constraints | 2026-11-20 |
| [006](prompts/006-real-api-testing.md) | Test with real API keys (and the Gemini bug it found) | Aaritra Kumar | Claude | Response evaluation, Chain | 2026-11-21 |
| [007](prompts/007-mistral-inspired-redesign.md) | Redesign: visually striking, modern and interactive | Aaritra Kumar | Claude | Role-based, Context-based, Structured, Constraints, Chain | 2026-11-21 |
| [008](prompts/008-jade-bench-palette.md) | Make the pixel style our own: Jade bench palette | Aaritra Kumar | Claude | Response evaluation, Refinement, Constraints, Chain | 2026-11-21 |
| [009](prompts/009-perplexity-research.md) | Research report: GD problem, formats, rubric, fallacies, case library | TBD | Perplexity | Context-based, Structured, Constraints | 2026-11-21 |

## AI tools used (guideline 2.3: at least three)

| Tool | Used by | What it did for the project |
|---|---|---|
| Claude (Claude Code) | Aaritra | Architecture plan, all app code, agent system prompts, two design iterations, prompt log |
| _ChatGPT_ | _TBD_ | _fill in_ |
| Perplexity | _TBD_ | Research report ([docs/research-report.md](docs/research-report.md)): the GD problem, debate formats, judging rubric, fallacies, and the 8-case library with sourced facts for and against |

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
