import type { Metadata } from "next";
import { FileCaseForm } from "@/components/FileCaseForm";
import { PixelArt } from "@/components/ui/PixelArt";
import { GAVEL, GAVEL_COLORS } from "@/components/ui/pixel-icons";
import { getCases } from "@/lib/cases";

export const metadata: Metadata = { title: "File a case — Courtroom AI" };

export default async function FilePage({ searchParams }: PageProps<"/file">) {
  const { case: caseParam, topic } = await searchParams;
  return (
    <div className="relative">
      <div className="grid-lines absolute inset-x-0 top-0 h-[28rem]" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-5 pt-14 sm:px-8 sm:pt-20">
        <p className="label">Clerk of the court</p>
        <h1 className="display mt-5 text-6xl sm:text-8xl">
          File a{" "}
          <span className="inline-block translate-y-[0.05em]">
            <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} animateIn interactive className="inline h-[0.75em] w-[0.75em]" label="Pixel gavel" />
          </span>{" "}
          case.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
          Put a debatable question to the court. The Prosecution argues for it, the Defence against, and the Judge decides.
        </p>
        <div className="mt-16">
          <FileCaseForm
            cases={getCases()}
            initialCaseId={typeof caseParam === "string" ? caseParam : undefined}
            initialTopic={typeof topic === "string" ? topic : undefined}
          />
        </div>
      </div>
    </div>
  );
}
