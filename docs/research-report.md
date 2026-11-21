# Courtroom AI: Research Report

Students often struggle in placement GDs because they must argue, listen, rebut, and think under time pressure—not merely speak well. The evidence below supports a two-AI-lawyer, multi-round debate format with an AI judge that evaluates reasoning, evidence, rebuttal, and logical discipline.

## 1. The problem

Placement GDs test analytical thinking, structured communication, collaboration, and the ability to respond to opposing views. In India’s 2026 campus-hiring research, employers prioritised analytical thinking, problem-solving, adaptability, and cross-functional collaboration; meanwhile, 68% of students said they were job-ready on Day 1, but only 9% of employers agreed. [huroorkee.ac](https://huroorkee.ac.in/blog/gd-topics-placements)

A widely cited Indian employability figure reports that **43.65% of graduates lack communication confidence in group settings**.  This aligns with the core GD challenge: students may know a topic but struggle to organise points, listen actively, challenge weak claims, and change position when evidence demands it. [myvoicecoach](https://www.myvoicecoach.in/blog/gd-topics-2026-campus-placement)

### One-sided thinking

Confirmation bias is the tendency to seek, interpret, and remember information that supports existing beliefs while discounting contrary evidence.  It produces **selective exposure**: people preferentially attend to belief-consistent information and avoid information that challenges their views. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC3978552/)

This matters for GD preparation because a student who has only prepared one side will usually repeat talking points rather than engage with the strongest opposing argument. A review of echo chambers defines the mechanism as repeated exposure to similar ideologies from like-minded peers or sources, reinforcing existing beliefs. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC9188446/)

| Evidence | What it shows | Source |
|---|---|---|
| 68% of students considered themselves job-ready, but 9% of employers agreed | A large readiness perception gap, including communication and workplace-readiness skills |  [huroorkee.ac](https://huroorkee.ac.in/blog/gd-topics-placements) |
| 43.65% of Indian graduates lack communication confidence in group settings | Confidence in group discussion is a major employability barrier |  [myvoicecoach](https://www.myvoicecoach.in/blog/gd-topics-2026-campus-placement) |
| Confirmation bias leads people to preferentially process belief-consistent information | Students may over-rely on one side’s arguments |  [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC3978552/) |
| Selective exposure makes people avoid challenging information | One-sided preparation can become habitual |  [ncbi.nlm.nih](https://www.ncbi.nlm.nih.gov/pmc/articles/11393549) |
| 20% of social-media users said social-media interaction changed their view on a political/social issue | Exposure to opposing views can change beliefs, but is not automatic |  [weforum](https://www.weforum.org/stories/emerging-technologies/echo-chambers-fact-or-ficition) |

**Important nuance:** “echo chambers” are real as a mechanism, but research does not uniformly find that everyone is fully isolated from opposing views. A study of 5,000 U.S. residents found no support for echo chambers in COVID-19 media use, while finding that people with lower information-seeking behaviour were more influenced by politicised news.  Your app should therefore *force balanced exposure* rather than assume users never see the other side. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC9195485/)

## 2. Debate formats

Competitive debate and moot court both use a structured sequence: establish a case, attack the opponent’s case, defend under questioning, and close by comparing the competing cases. This structure is directly reusable for Courtroom AI.

### Competitive debate

In the World Schools Debating Championship (WSDC) format, each side typically has constructive speeches, rebuttal opportunities, Points of Information (POIs), and a final reply speech. Judges assess each substantive speech out of 100: **40 for content, 40 for style, and 20 for strategy**; the reply speech is scored out of 50 using the same 40/40/20 proportions. [schoolsdebate](https://schoolsdebate.com/wp-content/uploads/docs/rules.asp)

| Round element | Purpose | App translation |
|---|---|---|
| Opening / constructive case | Define the motion, present arguments and evidence | AI Lawyer A gives a 2–3 minute opening with 2–3 claims |
| Rebuttal | Identify and answer the opponent’s strongest points | Each lawyer must explicitly quote or paraphrase the opponent’s claim before responding |
| Cross-examination / POIs | Test assumptions, evidence, and logical gaps | AI judge or opposing lawyer asks 1–2 targeted questions |
| Closing / reply speech | Compare the two cases and explain why one wins | Final round must rank impacts and address the opponent’s best argument |

WSDC guidance treats rebuttal as part of **content**: judges assess the quality of responses, including whether a debater responds to the underlying logic rather than merely an example.  Moot-court guidance similarly advises advocates to narrow rebuttal to two or three critical ideas and directly distinguish the opponent’s key arguments. [who.hdd](http://who.hdd.hr/wp-content/uploads/sites/2/2019/12/World-Schools-judge-guide.pdf)

### Moot court

Moot courts generally follow: petitioner/applicant submission, respondent submission, judge questions, rebuttal, and sometimes sur-rebuttal. Indian moot-court guidance describes judges evaluating legal knowledge, application of facts, forensic eloquence, responses to judicial queries, court manners, and written memorials. [alc.edu](https://alc.edu.in/blog/moot-court-for-law-students)

For a placement-oriented app, use a simplified moot-court structure: **Opening → Rebuttal → Cross-examination → Rebuttal → Verdict**. This gives students repeated practice at both making and defending claims, without requiring legal knowledge.

## 3. Judging rubric

The strongest available benchmark is WSDC: **content 40%, style 40%, strategy 20%**.  Content covers argument strength, analysis, evidence, and rebuttal; style covers clarity and persuasion; strategy covers case prioritisation, engagement, and effective use of the debate. [schoolsdebate](https://schoolsdebate.com/wp-content/uploads/docs/rules.asp)

For Courtroom AI, split “content” into reasoning and evidence so the AI judge can give actionable feedback rather than one opaque score.

| Criterion | What the AI judge evaluates | Suggested weight | Score anchors |
|---|---|---:|---|
| Reasoning and logic | Claims follow from premises; cause-effect links are valid; no unsupported leaps | 25% | 0–5 |
| Evidence and examples | Facts, data, cases, or examples are relevant, credible, and correctly used | 20% | 0–5 |
| Rebuttal and clash | The lawyer identifies the opponent’s actual argument and responds to its strongest version | 20% | 0–5 |
| Persuasiveness and delivery | Clarity, structure, confidence, audience awareness, and concise language | 15% | 0–5 |
| Strategy and case comparison | Prioritises decisive issues, explains why its side wins overall | 10% | 0–5 |
| Logical discipline | Absence or handling of fallacies; willingness to concede weak points | 10% | 0–5 |

**Total: 100 points per round.** This preserves the debate-world emphasis on matter, manner, and strategy while making fallacy detection a visible, teachable output. WSDC explicitly includes rebuttal quality within content and asks judges to assess the weight of clash from the standpoint of a reasonable person. [speechwire](https://www.speechwire.com/files/20366-Introduction-to-World-Schools-format-guide.pdf)

## 4. Common logical fallacies

| Fallacy | One-line definition | Short example |
|---|---|---|
| Ad hominem | Attacks the person rather than their argument. | “You cannot trust her view on taxes because she is rich.”  [grammarly](https://www.grammarly.com/blog/rhetorical-devices/logical-fallacies/) |
| Straw man | Misrepresents an opponent’s claim to make it easier to attack. | “You want safer roads, so you want to ban all cars.”  [scribbr](https://www.scribbr.com/fallacies/logical-fallacy/) |
| False dilemma | Presents only two options when more exist. | “Either we ban social media or accept misinformation.”  [germanna](https://germanna.edu/sites/default/files/2025-01/Logical%20Fallacies.pdf) |
| Slippery slope | Claims one small step will inevitably cause extreme consequences without adequate proof. | “Allowing late submissions will make every student stop submitting work.”  [grammarly](https://www.grammarly.com/blog/rhetorical-devices/logical-fallacies/) |
| Hasty generalisation | Draws a broad conclusion from insufficient evidence. | “My friend had a bad internship, so internships do not help students.” |
| Appeal to authority | Treats an authority’s view as conclusive without relevant evidence or reasoning. | “A CEO said it, so it must be true.” |
| Appeal to popularity | Argues that something is true because many people believe it. | “Most students want it, so it is the right policy.” |
| Circular reasoning | Uses the conclusion as support for itself. | “Remote learning works because it is effective.” |
| Post hoc | Assumes that because B followed A, A caused B. | “The company grew after the new app launched, so the app caused the growth.” |
| Red herring | Introduces an irrelevant issue to divert attention from the main argument. | “Why discuss campus placements when unemployment is a global issue?” |

These are the highest-value fallacies for an AI judge because they are common, detectable from argument structure, and immediately useful as feedback. A logical fallacy is an argument whose structure or content contains a flaw, even when it sounds persuasive. [germanna](https://germanna.edu/sites/default/files/2025-01/Logical%20Fallacies.pdf)

## 5. Existing AI debate tools

Existing tools show that AI can generate arguments, participate in debates, and evaluate persuasive language—but most do not provide a placement-focused, round-by-round, fallacy-aware judging experience.

| Tool / research system | What it does | What is missing for Courtroom AI |
|---|---|---|
| IBM Project Debater | An autonomous debating system that can debate humans across topics, with argument mining, rebuttal, and speech delivery components.  [pubmed.ncbi.nlm.nih](https://pubmed.ncbi.nlm.nih.gov/33731946/) | Not designed as a student practice product; limited placement-GD context, Indian topics, and simple rubric-based feedback |
| GPT-4 debate research | In a study of 900 debate pairs, personalised GPT-4 was more persuasive than humans in 64.4% of unequal-persuasiveness cases.  [pubmed.ncbi.nlm.nih](https://pubmed.ncbi.nlm.nih.gov/40389594/) | Demonstrates persuasion capability, but not a structured judge, fallacy log, or employability-oriented scoring system |
| LLM debate-agent research | Found that AI agents can blend into debates and focus on the topic, improving group productivity.  [ncbi.nlm.nih](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12015287/) | Does not establish a two-lawyer, multi-round, judge-scored practice workflow |
| General debate/argument platforms | Help users map arguments and explore multiple perspectives | Usually lack timed GD simulation, cross-examination, round-wise scoring, and placement-specific feedback |

### Gap for Courtroom AI

- **Balanced adversarial practice:** Two AI lawyers should be assigned opposing positions and required to engage with the other side’s strongest argument, directly countering selective exposure. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC3978552/)
- **Round-by-round evaluation:** The judge should score every round, not only produce a final winner.
- **Fallacy-specific feedback:** Flag the fallacy, quote the sentence, explain why it is flawed, and suggest a stronger replacement claim.
- **Evidence discipline:** Require each major claim to have a source, example, or clearly labelled assumption.
- **GD realism:** Use Indian placement-style topics, time limits, interruption/question rounds, and feedback on concision and teamwork-oriented language.

## What this means for our app

- Build the debate as **Opening → Rebuttal → Cross-examination → Rebuttal → Verdict**, with 3–5 rounds and a strict time limit per turn.
- Score each round out of 100 using **reasoning 25%, evidence 20%, rebuttal 20%, persuasiveness 15%, strategy 10%, logical discipline 10%**.
- Require each AI lawyer to first state the opponent’s claim before rebutting it, reducing straw-man arguments.
- Make the AI judge output a **fallacy table**: fallacy type, quoted statement, explanation, severity, and improved wording.
- Add a “steel-man the other side” prompt so each lawyer must present the opponent’s best argument before responding.
- Position the product as placement-GD training: concise points, structured argumentation, active listening, and confidence under pressure—not merely winning an argument.

## Case libraries

[
  {
    "id": "ai-jobs-replacement",
    "title": "Is AI replacing more jobs than it creates?",
    "description": "The debate concerns whether AI-driven automation will displace more workers than it creates new employment opportunities.",
    "facts": [
      { "side": "for", "fact": "The World Economic Forum projects AI and information-processing technologies will displace 9 million jobs by 2030.", "source": "https://www.weforum.org/publications/the-future-of-jobs-report-2025/2-jobs-outlook" },
      { "side": "for", "fact": "41% of employers surveyed plan to reduce their workforce where AI can automate tasks.", "source": "https://www.weforum.org/publications/the-future-of-jobs-report-2025" },
      { "side": "for", "fact": "The WEF expects technological and economic change to disrupt the equivalent of 22% of jobs by 2030.", "source": "https://www.weforum.org/publications/the-future-of-jobs-report-2025" },
      { "side": "against", "fact": "AI and information-processing trends are projected to create 11 million jobs while displacing 9 million by 2030.", "source": "https://www.weforum.org/publications/the-future-of-jobs-report-2025/2-jobs-outlook" },
      { "side": "against", "fact": "Global labour-market transformation is projected to create 170 million jobs and displace 92 million by 2030.", "source": "https://www.weforum.org/publications/the-future-of-jobs-report-2025" },
      { "side": "against", "fact": "The projected net employment change is 78 million additional jobs, or 7% growth in total employment.", "source": "https://www.weforum.org/publications/the-future-of-jobs-report-2025" }
    ]
  },
  {
    "id": "social-media-under-16-ban",
    "title": "Should social media be banned for children under 16?",
    "description": "The debate considers whether governments should prohibit social-media accounts for people younger than 16 to protect safety and wellbeing.",
    "facts": [
      { "side": "for", "fact": "Australia's 2024 law requires certain social-media platforms to prevent children under 16 from holding accounts.", "source": "https://www.aph.gov.au/Parliamentary_Business/Bills_Legislation/bd/bd2425/25bd039" },
      { "side": "for", "fact": "The Australian ban took effect on 10 December 2025 and covers platforms including Instagram, TikTok and Snapchat.", "source": "https://peo.gov.au/understand-our-parliament/history-of-parliament/history-milestones/australian-parliament-history-timeline/events/online-safety-amendment-social-media-minimum-age-act-2024" },
      { "side": "for", "fact": "Platforms can be fined up to A$49.5 million for serious or repeated failures to prevent underage accounts.", "source": "https://www.bbc.com/news/articles/cwyp9d3ddqyo" },
      { "side": "against", "fact": "The ban applies to account-based services, while gaming and messaging platforms are exempt.", "source": "https://www.bbc.com/news/articles/c89vjj0lxx9o" },
      { "side": "against", "fact": "Under-16s can still access some covered platforms, including YouTube, without creating an account.", "source": "https://www.bbc.com/news/articles/c89vjj0lxx9o" },
      { "side": "against", "fact": "The law depends on platforms building age-assurance systems, creating implementation and verification challenges.", "source": "https://peo.gov.au/understand-our-parliament/history-of-parliament/history-milestones/australian-parliament-history-timeline/events/online-safety-amendment-social-media-minimum-age-act-2024" }
    ]
  },
  {
    "id": "mandatory-college-attendance-india",
    "title": "Should attendance be mandatory in Indian colleges?",
    "description": "The debate examines whether Indian colleges should require minimum classroom attendance for academic eligibility and learning.",
    "facts": [
      { "side": "for", "fact": "The University Grants Commission's undergraduate framework prescribes a minimum of 75% attendance in each course.", "source": "https://www.ugc.gov.in/" },
      { "side": "for", "fact": "Attendance requirements give institutions a consistent basis for examination eligibility and academic monitoring.", "source": "https://www.ugc.gov.in/" },
      { "side": "for", "fact": "Regular attendance can support participation in lectures, discussions, laboratories and continuous assessment.", "source": "https://www.ugc.gov.in/" },
      { "side": "against", "fact": "Attendance rules may disadvantage students managing paid work, internships, health needs or family responsibilities.", "source": "https://www.ugc.gov.in/" },
      { "side": "against", "fact": "Requiring physical presence can limit flexibility even when students can access recorded lectures and online material.", "source": "https://www.ugc.gov.in/" },
      { "side": "against", "fact": "Attendance alone does not measure engagement, comprehension or academic performance.", "source": "https://www.ugc.gov.in/" }
    ]
  },
  {
    "id": "four-day-work-week-productivity",
    "title": "Is a 4-day work week better for productivity?",
    "description": "The debate assesses whether reducing the standard work week to four days improves productivity, wellbeing and business performance.",
    "facts": [
      { "side": "for", "fact": "In the UK's six-month trial, 92% of participating companies continued or planned to continue the four-day week.", "source": "https://www.bbc.co.uk/news/business-64669987" },
      { "side": "for", "fact": "Participating companies reported a 65% reduction in sick days and a 57% fall in staff leaving.", "source": "https://www.sociology.cam.ac.uk/news/new-results-worlds-largest-trial-four-day-working-week" },
      { "side": "for", "fact": "Among 23 companies providing financial data, revenue rose by 1.4% on average during the trial.", "source": "https://www.sociology.cam.ac.uk/news/new-results-worlds-largest-trial-four-day-working-week" },
      { "side": "against", "fact": "Only 23 of the UK trial's participating organisations provided revenue data, limiting the financial evidence.", "source": "https://www.bbc.co.uk/news/business-64669987" },
      { "side": "against", "fact": "The trial was voluntary and involved a limited group of UK organisations rather than a representative national sample.", "source": "https://www.sociology.cam.ac.uk/news/new-results-worlds-largest-trial-four-day-working-week" },
      { "side": "against", "fact": "Company revenue broadly stayed the same during the trial, rather than showing a large productivity-driven increase.", "source": "https://www.bbc.co.uk/news/business-64669987" }
    ]
  },
  {
    "id": "jaipur-walled-city-car-ban",
    "title": "Should India ban cars in old city areas like Jaipur's Walled City?",
    "description": "The debate considers whether restricting private cars in historic urban cores such as Jaipur's Walled City would improve mobility, heritage protection and air quality.",
    "facts": [
      { "side": "for", "fact": "UNESCO inscribed Jaipur City, including its planned historic core, on the World Heritage List in 2019.", "source": "https://whc.unesco.org/en/list/1607/" },
      { "side": "for", "fact": "Jaipur's historic urban fabric includes narrow streets and dense built form that constrain vehicle movement.", "source": "https://whc.unesco.org/en/list/1607/" },
      { "side": "for", "fact": "Reducing motor-vehicle emissions can improve outdoor air quality and reduce health risks in urban areas.", "source": "https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health" },
      { "side": "against", "fact": "Car restrictions can displace traffic, parking demand and deliveries to surrounding neighbourhoods without adequate alternatives.", "source": "https://www.itdp.org/" },
      { "side": "against", "fact": "Historic-area traffic policies need to protect resident access, emergency services, deliveries and local businesses.", "source": "https://www.itdp.org/" },
      { "side": "against", "fact": "Restrictions are more effective when supported by reliable public transport, pedestrian infrastructure and enforcement.", "source": "https://www.itdp.org/" }
    ]
  },
  {
    "id": "cryptocurrency-future-of-finance",
    "title": "Is cryptocurrency the future of finance?",
    "description": "The debate evaluates whether cryptocurrencies and related blockchain systems will become a central part of the future financial system.",
    "facts": [
      { "side": "for", "fact": "India ranked first among 151 countries in Chainalysis's 2024 Global Crypto Adoption Index.", "source": "https://www.chainalysis.com/blog/2024-global-crypto-adoption-index/" },
      { "side": "for", "fact": "India led global crypto adoption for a second consecutive year despite stringent regulation and high trading taxes.", "source": "https://www.reuters.com/technology/india-leads-crypto-adoption-second-straight-year-report-shows-2024-09-11/" },
      { "side": "for", "fact": "Blockchain-based systems can enable peer-to-peer digital value transfer without a traditional central intermediary.", "source": "https://www.bis.org/" },
      { "side": "against", "fact": "Cryptocurrency prices can be highly volatile, creating risks for savers, investors and payment users.", "source": "https://www.rbi.org.in/" },
      { "side": "against", "fact": "India taxes income from virtual digital assets at 30%, plus applicable surcharge and cess, with restricted loss offsets.", "source": "https://incometaxindia.gov.in/" },
      { "side": "against", "fact": "The Reserve Bank of India has repeatedly warned that private cryptocurrencies can pose risks to financial stability and consumer protection.", "source": "https://www.rbi.org.in/" }
    ]
  },
  {
    "id": "ai-art-in-competitions",
    "title": "Should AI-generated art be allowed in competitions?",
    "description": "The debate considers whether art competitions should permit entries created with generative AI, and under what disclosure or authorship rules.",
    "facts": [
      { "side": "for", "fact": "The US Copyright Office recognises that works combining human-authored elements with AI-generated material can be copyrightable.", "source": "https://www.copyright.gov/ai/ai_policy_guidance.pdf" },
      { "side": "for", "fact": "Human selection, arrangement or substantial modification of AI output can constitute protectable creative authorship.", "source": "https://www.copyright.gov/ai/ai_policy_guidance.pdf" },
      { "side": "for", "fact": "Allowing AI-assisted entries can expand participation by creators who lack formal training or expensive production tools.", "source": "https://hai.stanford.edu/" },
      { "side": "against", "fact": "The US Copyright Office says prompts alone do not provide enough human control to make a user the author of AI output.", "source": "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf" },
      { "side": "against", "fact": "Copyright does not extend to purely AI-generated material or material with insufficient human control over expression.", "source": "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf" },
      { "side": "against", "fact": "AI-generated works can raise concerns about originality, consent and the use of artists' styles and training data.", "source": "https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf" }
    ]
  },
  {
    "id": "drop-year-competitive-exams",
    "title": "Is taking a drop year for competitive exams worth it?",
    "description": "The debate weighs whether students should take a year after school to prepare again for competitive examinations such as JEE or NEET.",
    "facts": [
      { "side": "for", "fact": "NTA permits candidates to appear for NEET-UG in multiple years, allowing a second, focused preparation attempt.", "source": "https://neet.nta.nic.in/" },
      { "side": "for", "fact": "A drop year can give students additional time to revise syllabi, practise mock tests and address earlier preparation gaps.", "source": "https://neet.nta.nic.in/" },
      { "side": "for", "fact": "For some students, an improved rank can widen access to preferred colleges and courses.", "source": "https://neet.nta.nic.in/" },
      { "side": "against", "fact": "A repeat attempt does not guarantee admission because seats, cutoffs and competition can change each year.", "source": "https://neet.nta.nic.in/" },
      { "side": "against", "fact": "A drop year can create financial costs and psychological pressure from delayed entry into college or employment.", "source": "https://www.who.int/news-room/fact-sheets/detail/mental-disorders" },
      { "side": "against", "fact": "Students may have credible alternatives, including other colleges, courses, skill programmes or employment pathways.", "source": "https://www.education.gov.in/" }
    ]
  }
]
