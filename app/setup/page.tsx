import type { Metadata } from "next";
import { connection } from "next/server";
import { SetupScreen } from "@/components/SetupScreen";
import { getEnvStatus } from "@/lib/env";

export const metadata: Metadata = { title: "Setup — Courtroom AI" };

export default async function SetupPage() {
  await connection(); // read env vars at request time, not build time
  return <SetupScreen status={getEnvStatus()} />;
}
