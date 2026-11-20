// Reads our prompt history from /prompts/*.md for the "How we built this" page.
// Each file has YAML front matter (id, title, author, tool, techniques...) and
// "## " sections (Prompt, Before, Why we changed it, Result, What we learned).
import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PromptEntry {
  id: string;
  title: string;
  author: string;
  tool: string;
  techniques: string[];
  date: string;
  screenshot?: string;
  sections: { heading: string; body: string }[];
}

const PROMPTS_DIR = path.join(process.cwd(), "prompts");

/** Splits Markdown into sections at each "## Heading" (ignoring ## inside code fences). */
function splitSections(markdown: string) {
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; lines: string[] } | null = null;
  let inFence = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^(```|````)/.test(line.trim())) inFence = !inFence;
    const h = !inFence && line.match(/^## (.+)/);
    if (h) {
      if (current) sections.push({ heading: current.heading, body: current.lines.join("\n").trim() });
      current = { heading: h[1].trim(), lines: [] };
    } else current?.lines.push(line);
  }
  if (current) sections.push({ heading: current.heading, body: current.lines.join("\n").trim() });
  return sections.filter((s) => s.body);
}

export function getPromptLog(): PromptEntry[] {
  return readdirSync(PROMPTS_DIR)
    .filter((f) => /^\d{3}.*\.md$/.test(f)) // skips _TEMPLATE.md and the outputs/ folder
    .sort()
    .map((file) => {
      const { data, content } = matter(readFileSync(path.join(PROMPTS_DIR, file), "utf8"));
      return {
        id: String(data.id ?? file.slice(0, 3)),
        title: String(data.title ?? file),
        author: String(data.author ?? "Unknown"),
        tool: String(data.tool ?? "Unknown"),
        techniques: Array.isArray(data.techniques) ? data.techniques.map(String) : [],
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
        screenshot: data.screenshot ? String(data.screenshot) : undefined,
        sections: splitSections(content),
      };
    });
}
