# Courtroom AI — notes for Claude sessions

College Prompt Engineering final project (JECRC University). Team: **Aaritra Kumar** (Aari, main user here), **Tanushree**, **Rounak**.
The full build brief is prompt 001: `prompts/001-initial-project-prompt.md`. Follow its constraints and build order.

## Design (decided in prompts 004–005)
- Concept: **the court record** — editorial, restrained. Warm near-black (`bg`), ink text, one brass accent; `pros` red / `def` blue only mark the sides.
- Type: Instrument Serif (statements, headlines), Geist (UI), Geist Mono (`.label` docket metadata).
- Avoid: glows, gradients, halos, pill buttons, icon-in-circle emblems, cartoon characters, emoji. Use hairline rules (`border-line`) and sharp rectangles.
- Tokens live in `app/globals.css` (`@theme`). Party colours/names in `lib/speakers.ts`.

## Prompt logging (mandatory, every session)

Every prompt Aaritra gives you in this project gets logged — the graders check prompt history.

1. After handling a prompt, create `prompts/NNN-short-title.md` from `prompts/_TEMPLATE.md` (next free 3-digit number).
2. `author: "Aaritra Kumar"`, `tool: "Claude"`, unless Aaritra says the prompt is from a teammate or another tool.
3. **Make it presentable:** fix spelling/grammar and casual phrasing in the prompt text, but keep its meaning and every instruction. If the prompt refines an earlier one, fill in **Before** and **Why we changed it**.
4. **Result:** a short summary of what you actually did (files, features, decisions). If the output itself is worth showing (a plan, a design), save it in `prompts/outputs/NNN-*.md`.
5. Pick `techniques` from the exact list in `PROMPTS.md`.
6. Add a row to the Index table in `PROMPTS.md`.
7. Skip trivial ones (e.g. "yes", "continue", "commit") — fold them into the previous prompt's Result instead.

When a teammate's prompt from ChatGPT/Perplexity/etc. is pasted in, log it the same way with their name and tool, and update the "AI tools used" table in `PROMPTS.md`.

## Commits
- Conventional commits (`feat:`, `fix:`, `docs:`). Commit prompt-log changes as `docs: log prompt NNN`.
- No Co-Authored-By lines (same rule as Aaritra's portfolio).
- Never commit `.env.local` or real API keys.
