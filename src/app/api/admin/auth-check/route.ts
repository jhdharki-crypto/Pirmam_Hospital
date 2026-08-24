import { NextResponse } from "next/server";

/* In-memory rate limit store for Vercel serverless */
const ipAttempts: Record<string, { count: number; firstAttempt: number; blockedUntil: number }> = {};

/* Settings */
const MAX_IP_ATTEMPTS = 15; /* Max attempts per IP in window */
const WINDOW_MS = 5 * 60 * 1000; /* 5 minute window */
const IP_BLOCK_DURATION_MS = 5 * 60 * 1000; /* Block for 5 minutes */

/* Cleanup old entries every call (prevents memory leak) */
function cleanup() {
  const now = Date.now();
  for (const key of Object.keys(ipAttempts)) {
    if (now - ipAttempts[key].firstAttempt > WINDOW_MS + IP_BLOCK_DURATION_MS) {
      delete ipAttempts[key];
    }
  }
}

/* GET /api/admin/auth-check - Check if IP is rate-limited */
export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  cleanup();

  const record = ipAttempts[ip];
  if (record && record.blockedUntil > Date.now()) {
    return NextResponse.json(
      { error: "IP is rate-limited. Try again later." },
      { status: 429 }
    );
  }

  return NextResponse.json({ allowed: true });
}
