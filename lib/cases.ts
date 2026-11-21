// Case Library: reads /data/cases/*.json on the server.
import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { CaseFile } from "@/lib/types";

const CASES_DIR = path.join(process.cwd(), "data", "cases");

/** Loads every case file. The file name (without .json) becomes the case id. */
export function getCases(): CaseFile[] {
  return readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => {
      const data = JSON.parse(readFileSync(path.join(CASES_DIR, file), "utf8"));
      return {
        id: file.replace(/\.json$/, ""),
        title: String(data.title),
        description: String(data.description),
        facts: Array.isArray(data.facts)
          ? data.facts.map((f: { fact: unknown; source: unknown; side?: unknown }) => ({
              fact: String(f.fact),
              source: String(f.source),
              side: f.side === "for" || f.side === "against" ? f.side : undefined,
            }))
          : [],
      };
    });
}

export function getCase(id: string | undefined): CaseFile | undefined {
  if (!id) return undefined;
  return getCases().find((c) => c.id === id);
}
