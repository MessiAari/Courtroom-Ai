---
id: "012"
title: "Case Library: 8 researched cases with sourced facts for and against"
author: "Aaritra Kumar"
tool: "Perplexity"
techniques: ["Role-based", "Context-based", "Structured", "Clear instructions and constraints"]
date: "2026-11-21"
screenshot: ""
---

## Prompt (final version we sent)

````markdown
ROLE: You are a fact-checker preparing evidence files for a debate competition.

TASK: Create 8 debate case files on topics relevant to Indian college
students. For each topic, give 3 facts supporting the FOR side and 3 facts
supporting the AGAINST side, each with a real source URL.

Topics:
1. Is AI replacing more jobs than it creates?
2. Should social media be banned for children under 16?
3. Should attendance be mandatory in Indian colleges?
4. Is a 4-day work week better for productivity?
5. Should India ban cars in old city areas like Jaipur's Walled City?
6. Is cryptocurrency the future of finance?
7. Should AI-generated art be allowed in competitions?
8. Is taking a drop year for competitive exams worth it?

CONTEXT: These files will be fed to two AI lawyers in our app as evidence,
so the facts must be accurate, recent (2023 or later where possible) and
short enough to quote in a debate.

CONSTRAINTS:
- Every fact must have a working source URL. If you can't verify a fact,
  leave it out.
- Each fact must be under 30 words.
- Keep both sides balanced and neutral.

OUTPUT FORMAT: Valid JSON only, one object per case, in this structure:
{
  "id": "short-kebab-case-id",
  "title": "...",
  "description": "one-sentence neutral summary",
  "facts": [
    { "side": "for", "fact": "...", "source": "https://..." },
    { "side": "against", "fact": "...", "source": "https://..." }
  ]
}
````

## Result

- Perplexity returned 8 JSON case files, each with 3 FOR and 3 AGAINST facts and a source URL.
- Claude replaced our 3 placeholder cases with these in `data/cases/`. Each fact keeps its FOR/AGAINST tag, and the lawyers' prompt tells each side to prefer its own evidence ([E1]–[E6]) and cite the other side's only to rebut it.
- Tested live: the Prosecution cited [E1]–[E3], the Defence [E4]–[E6], and the rebuttal restated the Defence's point first.

## What we learned

- Asking for a fixed JSON shape (`id`, `title`, `description`, `facts[{side, fact, source}]`) meant the research could be imported straight into the app with no retyping.
- The 30-word limit kept every fact short enough for a lawyer to quote inside a 100-word turn.
- Some facts cite only a homepage (e.g. ugc.gov.in, rbi.org.in, itdp.org) rather than the exact page, and a few are opinions rather than facts. These should be tightened before the final submission.
