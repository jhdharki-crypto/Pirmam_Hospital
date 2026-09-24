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

   Brute-force protection is stored in the DATABASE (SiteSetting
   keys prefixed "rl:login:"), so the limit is shared across every
   serverless instance. 5 failed attempts trigger a 15 minute lock
   that blocks wrong passwords; a CORRECT password still works and
   clears the record, so the owner can never be locked out.
   ============================================================ */

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
/* Failure counts reset after this much time between attempts */
const FAILURE_WINDOW_MS = 10 * 60 * 1000;

const rlKey = (ip: string) => `rl:login:${ip}`;

type LoginRecord = { count: number; lockedUntil: number; lastAt: number };

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

async function readLoginRecord(ip: string): Promise<LoginRecord | null> {
  const row = await db.siteSetting.findUnique({ where: { key: rlKey(ip) } });
  if (!row) return null;
  try {
    const parsed = JSON.parse(row.value) as Partial<LoginRecord>;
    if (typeof parsed.count !== "number") return null;
    return {
      count: parsed.count,
      lockedUntil: parsed.lockedUntil ?? 0,
      lastAt: parsed.lastAt ?? 0,
    };
  } catch {
    return null;
  }
}

async function writeLoginRecord(ip: string, rec: LoginRecord) {
  const value = JSON.stringify(rec);
  await db.siteSetting.upsert({
    where: { key: rlKey(ip) },
    update: { value },
    create: { key: rlKey(ip), value },
  });
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
    const rec = await readLoginRecord(ip);

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

    // Verify FIRST: a correct password always works, even while the IP is
    // locked (the lock only exists to stop wrong-password guessing, and a
    // successful login clears the record so the owner is never locked out).
    if (!(await verifyPassword(stored, password, secret))) {
      // Wrong password: enforce the lockout window
      if (rec && rec.lockedUntil > now) {
        const minutes = Math.ceil((rec.lockedUntil - now) / 60000);
        return NextResponse.json(
          {
            error: `هەوڵی زۆر زۆر درا. تکایە ${minutes} خولەک چاوەڕوان بە`,
          },
          { status: 429 }
        );
      }
      // Fresh counter when the previous lock expired or attempts went stale
      const base =
        rec && rec.lockedUntil <= now && now - rec.lastAt < FAILURE_WINDOW_MS
          ? rec
          : { count: 0, lockedUntil: 0, lastAt: 0 };
      const count = base.count + 1;
      const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCK_MS : 0;
      await writeLoginRecord(ip, { count, lockedUntil, lastAt: now });
      return NextResponse.json({ error: "وشەی نهێنی هەڵەیە" }, { status: 401 });
    }

    // Upgrade legacy plaintext password to a salted hash
    if (!stored.startsWith("sha256$")) {
      await db.siteSetting.update({
        where: { key: "adminPassword" },
        data: { value: await hashPassword(password, secret) },
      });
    }

    // Correct password: clear any failure record and continue
    await db.siteSetting.deleteMany({ where: { key: rlKey(ip) } });

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
