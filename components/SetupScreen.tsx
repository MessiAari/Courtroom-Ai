// Shown when API keys are missing. Lists which env variables are set — never their values.
import { PixelArt } from "@/components/ui/PixelArt";
import { GAVEL, GAVEL_COLORS } from "@/components/ui/pixel-icons";
import type { EnvStatus } from "@/lib/env";

const KEYS = [
  { key: "GROQ_API_KEY", flag: "groq", who: "Prosecution + Defence (main), and the Judge's fallback.", url: "https://console.groq.com/keys" },
  { key: "GEMINI_API_KEY", flag: "gemini", who: "The Judge and the Ask the Judge chat (main).", url: "https://aistudio.google.com/apikey" },
  { key: "MISTRAL_API_KEY", flag: "mistral", who: "Fallback for the lawyers. Optional, recommended.", url: "https://console.mistral.ai/api-keys" },
] as const;

export function SetupScreen({ status }: { status: EnvStatus }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-14 sm:px-8 sm:pt-20">
      <p className="label">Setup</p>
      <h1 className="display mt-5 max-w-3xl text-5xl sm:text-7xl">
        {status.ready ? "The court is ready." : "The court is not in session yet."}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        {status.ready
          ? "The required keys are configured. You can file a case."
          : "Courtroom AI needs free API keys to run the debate. Add them as environment variables, then restart the server."}
      </p>

      <ul className="mt-14 grid gap-4 md:grid-cols-3">
        {KEYS.map((k) => {
          const set = status[k.flag];
          return (
            <li key={k.key} className={`flex flex-col rounded-2xl border p-6 ${set ? "border-line bg-surface" : "border-danger/40 bg-danger/[0.06]"}`}>
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-2 font-pixel text-xs uppercase ${set ? "text-accent" : "text-danger"}`}>
                  <span className={`h-2 w-2 ${set ? "bg-accent" : "bg-danger"}`} /> {set ? "Set" : "Missing"}
                </span>
              </div>
              <p className="mt-6 break-all font-mono text-sm text-ink">{k.key}</p>
              <p className="mt-2 flex-1 text-sm text-muted">{k.who}</p>
              <a href={k.url} target="_blank" rel="noreferrer" className="mt-5 text-sm font-medium text-accent hover:underline">
                Get a free key →
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:p-8">
        <PixelArt bitmap={GAVEL} colors={GAVEL_COLORS} className="h-12 w-12 shrink-0" />
        <ol className="space-y-3 text-muted">
          <li>
            <span className="font-semibold text-ink">Locally:</span> copy <code className="font-mono text-sm text-accent">.env.example</code> to{" "}
            <code className="font-mono text-sm text-accent">.env.local</code>, paste your keys, restart <code className="font-mono text-sm text-accent">npm run dev</code>.
          </li>
          <li>
            <span className="font-semibold text-ink">On Vercel:</span> Project → Settings → Environment Variables → add each key → Redeploy.
          </li>
          <li>
            <span className="font-semibold text-ink">Minimum:</span> a Groq key alone can play all three roles. Add Gemini for the Judge and Mistral as a backup.
          </li>
        </ol>
      </div>
    </div>
  );
}
