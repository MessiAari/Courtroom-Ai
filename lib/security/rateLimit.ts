// Per-IP rate limiting with no paid service.
// A sliding window kept in memory: each server instance remembers the
// timestamps of recent requests per IP (and per group of routes).
// On Vercel, warm instances are reused, so this stops spam loops and quota
// burning; it is "best effort" — separate instances keep separate counts.
import "server-only";

export type Bucket = "debate" | "chat";

interface Rule {
  windowMs: number;
  max: number;
}

// A Full hearing makes ~15 debate calls in ~2–3 minutes, so real users never hit these.
const RULES: Record<Bucket, Rule[]> = {
  debate: [
    { windowMs: 10_000, max: 8 }, // burst: 8 calls in 10 s
    { windowMs: 10 * 60_000, max: 60 }, // about 4 Full hearings per 10 min
  ],
  chat: [
    { windowMs: 20_000, max: 5 }, // 5 questions in 20 s
    { windowMs: 10 * 60_000, max: 30 },
  ],
};
// Safety net for the whole instance (all IPs together) — protects the free quota.
const GLOBAL: Rule = { windowMs: 60_000, max: 240 };

const hits = new Map<string, number[]>();
const globalHits: number[] = [];

function prune(list: number[], now: number, windowMs: number) {
  while (list.length && now - list[0] > windowMs) list.shift();
}

/** The caller's IP. Vercel sets x-forwarded-for itself (clients can't spoof the first entry). */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
}

/** Records the request and says whether it is allowed. */
export function rateLimit(ip: string, bucket: Bucket): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const longest = Math.max(...RULES[bucket].map((r) => r.windowMs));

  prune(globalHits, now, GLOBAL.windowMs);
  if (globalHits.length >= GLOBAL.max) return { ok: false, retryAfter: Math.ceil((GLOBAL.windowMs - (now - globalHits[0])) / 1000) };

  const key = `${bucket}:${ip}`;
  const list = hits.get(key) ?? [];
  prune(list, now, longest);
  for (const rule of RULES[bucket]) {
    const recent = list.filter((t) => now - t <= rule.windowMs);
    if (recent.length >= rule.max) return { ok: false, retryAfter: Math.ceil((rule.windowMs - (now - recent[0])) / 1000) };
  }
  list.push(now);
  globalHits.push(now);
  hits.set(key, list);

  // Keep memory small: forget idle IPs now and then.
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > longest) hits.delete(k);
  return { ok: true };
}
