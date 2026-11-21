import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/primitives";
import { Courtroom } from "@/components/courtroom/Courtroom";
import { SetupScreen } from "@/components/SetupScreen";
import { getCase } from "@/lib/cases";
import { getEnvStatus } from "@/lib/env";
import { validateCase } from "@/lib/validation";

export const metadata: Metadata = { title: "In session — Courtroom AI" };

export default async function CourtroomPage({ searchParams }: PageProps<"/courtroom">) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

  // No keys configured → show the setup screen instead of a broken debate.
  const env = getEnvStatus();
  if (!env.ready) return <SetupScreen status={env} />;

  // Validate the topic again on the server (the URL could have been edited by hand).
  const check = validateCase(one(params.topic) ?? "");
  if (!check.ok) {
    return (
      <div className="mx-auto max-w-5xl px-5 pt-14 sm:px-8 sm:pt-20">
        <p className="label text-danger">Case dismissed</p>
        <h1 className="display mt-5 max-w-3xl text-5xl sm:text-7xl">The court can&apos;t hear this case.</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{check.message.replace(/^Case dismissed:\s*/, "")}</p>
        <ButtonLink href="/file" className="mt-10">File a case</ButtonLink>
      </div>
    );
  }

  const mode = one(params.mode) === "full" ? "full" : "quick";
  const caseFile = getCase(one(params.case));
  // `key` makes React start a fresh debate if the topic or mode changes.
  return <Courtroom key={`${check.topic}|${mode}`} topic={check.topic} mode={mode} caseId={caseFile?.id} />;
}
