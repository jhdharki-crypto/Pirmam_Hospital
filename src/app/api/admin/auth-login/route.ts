import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAdminToken } from "@/lib/admin-token";

/* In-memory rate limit store */
const ipAttempts: Record<
  string,
  { count: number; firstAttempt: number; blockedUntil: number }
> = {};

/* Settings */
const MAX_IP_ATTEMPTS = 15;
const WINDOW_MS = 5 * 60 * 1000; /* 5 minute window */
const IP_BLOCK_DURATION_MS = 5 * 60 * 1000; /* Block for 5 minutes */

/* Cleanup old entries */
function cleanup() {
  const now = Date.now();
  for (const key of Object.keys(ipAttempts)) {
    if (now - ipAttempts[key].firstAttempt > WINDOW_MS + IP_BLOCK_DURATION_MS) {
      delete ipAttempts[key];
    }
  }
}

function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

/* GET /api/admin/auth-login - Check if IP is rate-limited */
export async function GET(request: Request) {
  const ip = getIp(request);
  cleanup();

  const record = ipAttempts[ip];
  if (record && record.blockedUntil > Date.now()) {
    const remaining = Math.ceil((record.blockedUntil - Date.now()) / 1000);
    return NextResponse.json(
      { error: "IP is rate-limited", blocked: true, remainingSeconds: remaining },
      { status: 429 }
    );
  }

  return NextResponse.json({ allowed: true });
}

/* POST /api/admin/auth-login
   Verifies password and sets an httpOnly cookie with a signed token.
   This is the ONLY route that verifies the password - client never sees it. */
export async function POST(request: NextRequest) {
  const ip = getIp(request);
  cleanup();

  /* Check if IP is already blocked */
  if (!ipAttempts[ip]) {
    ipAttempts[ip] = { count: 0, firstAttempt: Date.now(), blockedUntil: 0 };
  }

  const record = ipAttempts[ip];
  if (record.blockedUntil > Date.now()) {
    const remaining = Math.ceil((record.blockedUntil - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many attempts. Try again later.", remainingSeconds: remaining },
      { status: 429 }
    );
  }

  /* Reset window if expired */
  if (Date.now() - record.firstAttempt > WINDOW_MS) {
    record.count = 0;
    record.firstAttempt = Date.now();
    record.blockedUntil = 0;
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    /* Get stored password from database */
    const setting = await db.siteSetting.findUnique({
      where: { key: "adminPassword" },
    });

    const storedPassword = setting?.value || "pirmam2025";

    if (storedPassword !== password) {
      /* Failed login: increment count */
      record.count += 1;

      if (record.count >= MAX_IP_ATTEMPTS) {
        record.blockedUntil = Date.now() + IP_BLOCK_DURATION_MS;
        return NextResponse.json(
          {
            error: "Too many attempts. IP blocked for 5 minutes.",
            remainingSeconds: Math.ceil(IP_BLOCK_DURATION_MS / 1000),
          },
          { status: 429 }
        );
      }

      const remaining = MAX_IP_ATTEMPTS - record.count;
      return NextResponse.json(
        { error: "Invalid password", remainingAttempts: remaining },
        { status: 401 }
      );
    }

    /* Successful login: reset attempts */
    record.count = 0;
    record.firstAttempt = Date.now();
    record.blockedUntil = 0;

    /* Create signed token */
    const token = await createAdminToken();

    /* Set httpOnly cookie */
    const response = NextResponse.json({ success: true });
    response.cookies.set("pirmam-auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, /* 24 hours */
    });

    return response;
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
