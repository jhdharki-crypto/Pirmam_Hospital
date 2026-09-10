import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminSecret,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "@/lib/admin-auth";

/* ============================================================
   POST /api/admin/auth-login - Login (server-side password check,
   sets an httpOnly cookie). The password never reaches client JS.
   GET  /api/admin/auth-login - Session check for the admin panel.
   DELETE /api/admin/auth-login - Logout (clears the cookie).
   ============================================================ */

/* In-memory rate limiting per server instance. On serverless each
   instance has its own store, so this is best-effort. */
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true });
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const now = Date.now();

    // Cheap cleanup so the map cannot grow without bound
    if (attempts.size > 1000) {
      for (const [key, rec] of attempts) {
        if (rec.lockedUntil < now && rec.count === 0) attempts.delete(key);
      }
    }

    const record = attempts.get(ip);
    if (record && record.lockedUntil > now) {
      const minutes = Math.ceil((record.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          error: `هەوڵی زۆر زۆر درا. تکایە ${minutes} خولەک چاوەڕوان بە`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const password = typeof body?.password === "string" ? body.password : "";
    if (!password) {
      return NextResponse.json(
        { error: "وشەی نهێنی پێویستە" },
        { status: 400 }
      );
    }

    const [storedRow, secret] = await Promise.all([
      db.siteSetting.findUnique({ where: { key: "adminPassword" } }),
      getAdminSecret(),
    ]);
    const stored = storedRow?.value ?? "";

    if (!(await verifyPassword(stored, password, secret))) {
      const previousCount =
        record && record.lockedUntil < now ? 0 : record?.count ?? 0;
      const count = previousCount + 1;
      attempts.set(ip, {
        count,
        lockedUntil: count >= MAX_ATTEMPTS ? now + LOCK_MS : 0,
      });
      return NextResponse.json(
        { error: "وشەی نهێنی هەڵەیە" },
        { status: 401 }
      );
    }

    // Upgrade legacy plaintext password to a salted hash
    if (!stored.startsWith("sha256$")) {
      await db.siteSetting.update({
        where: { key: "adminPassword" },
        data: { value: await hashPassword(password, secret) },
      });
    }

    attempts.delete(ip);

    const { token, maxAge } = await createSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "هەڵەیەکی سێرڤەر ڕوویدا" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
