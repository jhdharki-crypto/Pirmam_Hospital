/* Simple in-memory sliding-window rate limiter.
   Best-effort on serverless (each instance has its own store), but still
   stops abusive bursts and keeps the site safe behind a single instance
   or a warm deployment. Keyed by caller-supplied string (usually IP). */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Keep the map from growing without bound
  if (buckets.size > 10000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSec: 0 };
}

/* Best-effort client IP for rate limiting keys. */
export function requestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "local";
}

/* Standard 429 response with a Retry-After header. */
export function tooManyRequests(retryAfterSec: number): Response {
  return Response.json(
    { error: "داواکاری زۆر زۆرە. تکایە دواتر هەوڵ بدەوە." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}

/* Limits tuned per endpoint family. */
export const RATE_LIMITS = {
  /* Every admin API call from the panel - generous for normal use */
  admin: { limit: 120, windowMs: 60_000 },
  /* Public content fetch - a normal page load needs only a few */
  publicContent: { limit: 60, windowMs: 60_000 },
} as const;
