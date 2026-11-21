# Courtroom AI — notes for Claude sessions

College Prompt Engineering final project (JECRC University). Team: **Aaritra Kumar** (Aari, main user here), **Tanushree**, **Rounak**.
The full build brief is prompt 002: `prompts/002-initial-project-prompt.md`. Follow its constraints and build order.

## Design (decided in prompts 009–010, palette and characters changed in 013)
- **"Gilded bench" miniature pixel-art court game.** Charcoal canvas with film grain (`body::after`) and warm ambient light (`.ambient`), heavy Geist headlines, Silkscreen pixel font for numbers/stamps/OBJECTION!, hairline grid cells.
- Colours (prompt 013, chosen by the team): bg `#101114`, surface `#1B1A20`, ivory text `#E8DFCE`; **Judge gold `#C89B55`** (`gold-200…700`, `accent`); **Prosecution electric blue `#628BFF`** (`pros`); **Defence muted red `#E16B64`** (`def`); `danger` red for errors. Avoid heavy gradients and clutter.
- Pixel characters are drawn in code: `components/court/sprites.ts` (bitmaps + emotion faces), `CourtScene.tsx` (the live courtroom driven by debate state), `Cast.tsx` (portraits). Icons in `components/ui/pixel-icons.ts`. Credibility = fighting-game health bar (`components/ui/PixelMeter.tsx`).
- Tokens in `app/globals.css` (`@theme`); party names/colours/icons in `lib/speakers.ts`.

## Research
- Perplexity report: `docs/research-report.md`. Case Library facts in `data/cases/*.json` carry `side: "for" | "against"`.

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
