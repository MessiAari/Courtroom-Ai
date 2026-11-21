# Output of prompt 001: ChatGPT's improved prompt (v2, verbatim)

> Saved because the course guidelines ask us to keep "the original prompt and the output generated from it". We edited this into the final prompt 002.

````markdown
# Project: AI Courtroom – Multi-Agent Debate Platform

## Role
You are a senior full-stack developer, UI/UX designer, and AI engineer. Build a complete, functional, visually polished web application suitable for a college Prompt Engineering project.

## Project Overview
Build a web application where three AI agents participate in a structured debate on a user-provided topic:

1. **Prosecution / For AI** – Argues in favor of the topic with strong reasoning, facts, and examples.
2. **Defense / Against AI** – Argues against the topic with counterarguments, reasoning, and examples.
3. **Judge AI** – Impartially evaluates both sides, analyzes the arguments, identifies logical fallacies and weak reasoning, and declares a winner with a detailed verdict.

The application should help college students practice Group Discussions (GD), critical thinking, argumentation, public speaking preparation, and prompt engineering.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Lucide React for icons
- AI APIs: Gemini, Groq, and Mistral (use free-tier models wherever available)
- API calls must happen server-side to protect API keys.
- Use localStorage only for saving user debate history and preferences, if needed.
- No paid services or database required for the initial version.

---

## Core Features

### 1. Landing Page
Create a premium, cinematic landing page inspired by a modern courtroom.

Design elements:
- Dark theme with deep charcoal/black backgrounds.
- Gold/brass accents.
- Dramatic lighting and subtle gradients.
- Elegant typography.
- Animated courtroom atmosphere.
- Hero section featuring three AI personalities.
- A clear "Start a Debate" CTA.
- Example debate topics for users to try.
- Brief explanation of how the platform works.

Avoid generic SaaS templates. The design should feel like a sophisticated AI courtroom.

### 2. Debate Setup
Allow users to configure their debate:

- Enter any debate topic.
- Select debate difficulty (Beginner, Intermediate, Advanced).
- Select debate mode (Quick Debate or Full Debate).
- Optional: Choose AI provider.
- Display example topics such as:
  - Is AI replacing human jobs?
  - Should social media be banned for children?
  - Is cryptocurrency the future of finance?
  - Should college education be mandatory?
  - Does technology make people less social?

Validate inputs and prevent empty topics.

### 3. Debate Room
Create an immersive, animated courtroom interface.

Display three distinct AI participants:

**FOR AI**
- Green or blue visual identity.
- Advocate-style personality.
- Presents arguments supporting the topic.

**AGAINST AI**
- Red visual identity.
- Opposing advocate personality.
- Challenges assumptions and presents counterarguments.

**JUDGE AI**
- Gold visual identity.
- Neutral, authoritative personality.
- Observes the debate and eventually delivers the verdict.

The debate should feel like an actual conversation, not three unrelated AI-generated paragraphs.

### 4. Debate Structure

Implement a structured debate with the following rounds:

**Round 1 – Opening Statements**
- Both agents present their initial arguments.
- 3 arguments each.
- Include examples and reasoning.

**Round 2 – Rebuttals**
- Each agent responds directly to the opposing agent's arguments.
- They should identify weaknesses, challenge assumptions, and counter specific claims.

**Round 3 – Cross Examination**
- Each agent asks the opposing side 2 challenging questions.
- The opposing agent responds to those questions.

**Round 4 – Closing Arguments**
- Each agent summarizes its strongest arguments.
- Explain why its side is more convincing.

**Round 5 – Judicial Verdict**
Judge evaluates the entire debate and announces:
- Winner.
- Score for both sides (out of 100).
- Reasoning quality.
- Evidence quality.
- Rebuttal effectiveness.
- Logical consistency.
- Persuasiveness.
- Key strengths and weaknesses.
- Neutral summary of the topic.
- Final verdict explaining why the winner won.

Allow users to choose Quick Debate or Full Debate.

Quick Debate should use:
- Opening arguments.
- One rebuttal each.
- Final verdict.

Full Debate should include all rounds.

---

## 5. Judge Chatbot

After the debate finishes, users should be able to interact with the Judge AI.

Create a dedicated chat panel where users can ask questions such as:

- Why did the For AI win?
- Which argument was the weakest?
- What logical fallacies were used?
- What would make the losing side stronger?
- Explain the topic objectively.
- Give me points I can use in a college GD.
- What questions might an interviewer ask about this topic?
- How could I defend the losing side?

The Judge chatbot must have the context of the entire debate and its verdict.

Features:
- Streaming responses if supported.
- Chat history during the current debate.
- Suggested questions.
- Clear chat option.
- Loading indicator.
- Error handling and retry.

---

## 6. AI Architecture

Implement a reliable provider abstraction layer so different AI providers can be switched without rewriting the application.

Providers:
- Google Gemini
- Groq
- Mistral

Requirements:
- Use currently available free-tier models where possible.
- Make model selection configurable through environment variables.
- Keep API keys server-side.
- Support provider fallback when the primary provider fails.
- Handle rate limits, timeouts, invalid API responses, and unavailable models.
- Show understandable error messages to users.
- Never expose API keys in the frontend.
- Avoid wasting tokens through unnecessarily long prompts.
- Each AI must have a distinct role and system prompt.

Suggested architecture:

/app
  /page.tsx
  /debate
    /page.tsx
  /api
    /debate
    /judge
/components
/lib
  /ai
    provider.ts
    gemini.ts
    groq.ts
    mistral.ts
    prompts.ts
  /debate
    engine.ts
    types.ts

You may improve this structure if necessary.

---

## 7. UI/UX Requirements

The interface should be exceptionally polished.

### Visual Direction
Imagine:
- A futuristic courtroom.
- A premium AI product.
- A cinematic debate experience.
- Minimal but visually impressive.
- Dark interface with gold accents.
- Glassmorphism used subtly, not excessively.

### Animations
Use Framer Motion for:
- Page transitions.
- AI participant entrances.
- Speaking indicators.
- Typing animations.
- Debate message appearance.
- Round transitions.
- Judge verdict reveal.
- Score animations.
- Hover interactions.
- Smooth panel transitions.

Animations should feel intentional and smooth, not distracting.

### Responsive Design
Must work properly on:
- Desktop.
- Tablet.
- Mobile.

On mobile, reorganize the courtroom and debate panels instead of simply shrinking the desktop UI.

### Debate Interface
Include:
- Round progress indicator.
- Current speaker indicator.
- Animated active speaker.
- Debate transcript.
- Participant cards.
- Live debate status.
- Pause/resume if feasible.
- Skip round functionality.
- Judge verdict panel.
- Restart debate button.

---

## 8. Error Handling

Implement proper handling for:

- Missing API keys.
- API rate limits.
- Provider outages.
- Request timeouts.
- Invalid user input.
- Failed debate generation.
- Failed judge chat responses.
- Network errors.

If an AI request fails:
- Display a clear message.
- Allow retry.
- Don't crash the application.
- Preserve already-generated debate content whenever possible.

Add a clear setup screen/message if API keys haven't been configured.

---

## 9. Additional Features

If time permits, implement:

- Debate history saved locally.
- Ability to revisit past debates.
- Export debate as PDF or text.
- Copy arguments.
- Share debate summary.
- Topic suggestions.
- Random topic generator.
- "Practice Mode" where the user takes one side and debates against AI.
- Judge feedback on the user's arguments.
- GD preparation mode that generates:
  - Introduction.
  - Key arguments for both sides.
  - Counterarguments.
  - Conclusion.
  - Important facts/examples.
  - Possible GD questions.

Prioritize the core debate experience over these extras.

---

## 10. Development Instructions

Do not just provide an architecture, explanation, mockup, or pseudocode.

Actually implement the complete application.

Requirements:
- Write all necessary files.
- Use clean, modular, maintainable code.
- Use proper TypeScript types.
- Avoid unnecessary dependencies.
- Do not leave placeholder buttons.
- Do not use fake AI responses pretending to be real API output.
- Every visible interaction should work.
- Use realistic loading and error states.
- Ensure the project builds without errors.

If a feature cannot be implemented properly, explain why and provide the best working alternative.

---

## 11. Deliverables

Provide:

1. Complete source code for the entire project.
2. Exact folder structure.
3. `package.json` with dependencies.
4. `.env.example`.
5. Instructions for obtaining free API keys.
6. Exact installation commands.
7. Exact commands to run locally.
8. Instructions for deploying to Vercel.
9. Explanation of the AI architecture and how the three agents interact.
10. Troubleshooting common errors.

## Final Priority

Prioritize in this order:

1. A working AI debate system.
2. Genuine interaction between the three agents.
3. High-quality judge verdict.
4. Judge chatbot with debate context.
5. Premium courtroom UI.
6. Smooth animations.
7. Reliability and error handling.
8. Extra features.

Make the application feel like a real product that I could confidently demonstrate during my college Prompt Engineering project presentation.

Start by building the complete project. Do not stop at planning or asking me questions. Make sensible decisions independently.
````
