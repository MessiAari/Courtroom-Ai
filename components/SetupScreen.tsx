// Shown when API keys are missing. Lists which env variables are set — never their values.
import type { EnvStatus } from "@/lib/env";

const KEYS = [
  { key: "GROQ_API_KEY", flag: "groq", who: "Prosecution + Defence (main), and the Judge's fallback.", url: "https://console.groq.com/keys" },
  { key: "GEMINI_API_KEY", flag: "gemini", who: "The Judge and the Ask the Judge chat (main).", url: "https://aistudio.google.com/apikey" },
  { key: "MISTRAL_API_KEY", flag: "mistral", who: "Fallback for the lawyers. Optional, recommended.", url: "https://console.mistral.ai/api-keys" },
] as const;

export function SetupScreen({ status }: { status: EnvStatus }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <p className="label">Setup required</p>
      <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-none sm:text-6xl">
        {status.ready ? "The court is ready." : "The court is not in session yet."}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        {status.ready
          ? "The required keys are configured. You can file a case."
          : "Courtroom AI needs free API keys to run the debate. Add them as environment variables, then restart the server."}
      </p>

      <table className="mt-14 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line-strong font-mono text-[11px] uppercase tracking-wide text-faint">
            <th className="py-3 font-normal">Variable</th>
            <th className="py-3 font-normal">Status</th>
            <th className="hidden py-3 font-normal sm:table-cell">Used for</th>
            <th className="py-3 font-normal" />
          </tr>
        </thead>
        <tbody>
          {KEYS.map((k) => {
            const set = status[k.flag];
            return (
              <tr key={k.key} className="border-b border-line align-top">
                <td className="py-4 pr-4 font-mono text-sm text-ink">{k.key}</td>
                <td className={`py-4 pr-4 font-mono text-xs uppercase ${set ? "text-ink" : "text-pros"}`}>{set ? "Set" : "Missing"}</td>
                <td className="hidden py-4 pr-4 text-sm text-muted sm:table-cell">{k.who}</td>
                <td className="py-4 text-right">
                  <a href={k.url} target="_blank" rel="noreferrer" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
                    Get key
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-14 grid gap-4 border-t border-line pt-6 lg:grid-cols-[1fr_2.2fr]">
        <p className="label">How to add them</p>
        <ol className="space-y-3 text-muted">
          <li>
            <span className="text-ink">Locally —</span> copy <code className="font-mono text-sm text-ink">.env.example</code> to{" "}
            <code className="font-mono text-sm text-ink">.env.local</code>, paste your keys, restart{" "}
            <code className="font-mono text-sm text-ink">npm run dev</code>.
          </li>
          <li>
            <span className="text-ink">On Vercel —</span> Project → Settings → Environment Variables → add each key → Redeploy.
          </li>
          <li>
            <span className="text-ink">Minimum —</span> a Groq key alone can play all three roles. Add Gemini for the Judge and
            Mistral as a backup.
          </li>
        </ol>
      </div>
    </div>
  );
}
