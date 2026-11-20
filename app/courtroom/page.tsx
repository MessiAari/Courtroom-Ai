import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="mx-auto max-w-6xl px-5 pt-14">
        <p className="label text-pros">Case dismissed</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none sm:text-6xl">The court can&apos;t hear this case.</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{check.message.replace(/^Case dismissed:\s*/, "")}</p>
        <Link href="/file" className="mt-10 inline-block bg-ink px-6 py-3 text-sm font-medium text-bg hover:bg-brass">
          File a case →
        </Link>
      </div>
    );
  }

  const mode = one(params.mode) === "full" ? "full" : "quick";
  const caseFile = getCase(one(params.case));
  // `key` makes React start a fresh debate if the topic or mode changes.
  return <Courtroom key={`${check.topic}|${mode}`} topic={check.topic} mode={mode} caseId={caseFile?.id} />;
}
