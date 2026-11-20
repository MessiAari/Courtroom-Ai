import type { Metadata } from "next";
import { FileCaseForm } from "@/components/FileCaseForm";
import { getCases } from "@/lib/cases";

export const metadata: Metadata = { title: "File a case — Courtroom AI" };

export default async function FilePage({ searchParams }: PageProps<"/file">) {
  const { case: caseParam } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <p className="label">Clerk of the court</p>
      <h1 className="mt-4 font-serif text-6xl leading-none sm:text-7xl">File a case.</h1>
      <p className="mt-6 max-w-lg text-lg text-muted">
        Put a debatable question to the court. The Prosecution argues for it, the Defence against, and the Judge decides.
      </p>
      <div className="mt-14">
        <FileCaseForm cases={getCases()} initialCaseId={typeof caseParam === "string" ? caseParam : undefined} />
      </div>
    </div>
  );
}
