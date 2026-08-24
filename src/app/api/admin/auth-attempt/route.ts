import { NextResponse } from "next/server";

/* In-memory rate limit store for Vercel serverless */
const ipAttempts: Record<string, { count: number; firstAttempt: number; blockedUntil: number }> = {};

/* Settings */
const MAX_IP_ATTEMPTS = 15; /* Max attempts per IP in window */
const WINDOW_MS = 5 * 60 * 1000; /* 5 minute window */
const IP_BLOCK_DURATION_MS = 5 * 60 * 1000; /* Block for 5 minutes */

/* Cleanup old entries (prevents memory leak) */
function cleanup() {
  const now = Date.now();
  for (const key of Object.keys(ipAttempts)) {
    if (now - ipAttempts[key].firstAttempt > WINDOW_MS + IP_BLOCK_DURATION_MS) {
      delete ipAttempts[key];
    }
  }
}

/* POST /api/admin/auth-attempt - Record a login attempt for rate limiting */
export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  cleanup();

  let body: { success?: boolean };
  try {
    body = await request.json();
  } catch {
    body = { success: false };
  }

  if (!ipAttempts[ip]) {
    ipAttempts[ip] = { count: 0, firstAttempt: Date.now(), blockedUntil: 0 };
  }

  const record = ipAttempts[ip];

  /* If window expired, reset */
  if (Date.now() - record.firstAttempt > WINDOW_MS) {
    record.count = 0;
    record.firstAttempt = Date.now();
    record.blockedUntil = 0;
  }

  /* Successful login: reset attempts */
  if (body.success) {
    record.count = 0;
    record.firstAttempt = Date.now();
    record.blockedUntil = 0;
    return NextResponse.json({ ok: true });
  }

  /* Failed login: increment and check */
  record.count += 1;

  if (record.count >= MAX_IP_ATTEMPTS) {
    record.blockedUntil = Date.now() + IP_BLOCK_DURATION_MS;
    return NextResponse.json(
      { error: "Too many attempts. IP blocked for 5 minutes." },
      { status: 429 }
    );
  }

  return NextResponse.json({
    ok: true,
    remainingAttempts: MAX_IP_ATTEMPTS - record.count,
  });
}
