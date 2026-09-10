import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ============================================================
   Server-side admin authentication.

   - The password is stored in the database as "sha256$<hex>",
     salted with a per-installation random secret (SiteSetting
     key "adminSecret"). Legacy plaintext values are accepted at
     login and upgraded to a hash automatically.
   - Login sets an httpOnly cookie holding an expiry-signed token;
     every /api/admin/* route verifies it via requireAdmin().
   - Uses only Web Crypto (crypto.subtle), so it works on any
     runtime. No middleware involved (Edge had broken the old
     implementation - see worklog "Remove middleware...").
   ============================================================ */

export const ADMIN_COOKIE = "pirmam_admin";
export const SENSITIVE_SETTING_KEYS = ["adminPassword", "adminSecret"];

const SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TOKEN_VERSION = "v1";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

/* Per-installation signing secret. Created on first use; never rotated
   (rotating would invalidate all stored password hashes and sessions). */
export async function getAdminSecret(): Promise<string> {
  const existing = await db.siteSetting.findUnique({
    where: { key: "adminSecret" },
  });
  if (existing?.value) return existing.value;
  const secret = randomHex(32);
  try {
    await db.siteSetting.create({
      data: { key: "adminSecret", value: secret },
    });
    return secret;
  } catch {
    // Lost a create race against another serverless invocation
    const row = await db.siteSetting.findUnique({
      where: { key: "adminSecret" },
    });
    if (!row?.value) throw new Error("Failed to initialize admin secret");
    return row.value;
  }
}

export async function hashPassword(
  password: string,
  secret: string
): Promise<string> {
  return `sha256$${await sha256Hex(`${TOKEN_VERSION}:${secret}:${password}`)}`;
}

/* Legacy plaintext values are compared directly; the login route
   upgrades them to a salted hash after a successful login. */
export async function verifyPassword(
  stored: string,
  password: string,
  secret: string
): Promise<boolean> {
  if (stored.startsWith("sha256$")) {
    return (await hashPassword(password, secret)) === stored;
  }
  return stored.length > 0 && stored === password;
}

export async function createSessionToken(): Promise<{
  token: string;
  maxAge: number;
}> {
  const secret = await getAdminSecret();
  const expires = Date.now() + SESSION_MS;
  const sig = await sha256Hex(`${TOKEN_VERSION}:${secret}:${expires}`);
  return {
    token: `${expires}.${sig}`,
    maxAge: Math.floor(SESSION_MS / 1000),
  };
}

async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expires = Number(token.slice(0, dot));
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const secret = await getAdminSecret();
  const expected = await sha256Hex(`${TOKEN_VERSION}:${secret}:${expires}`);
  return token.slice(dot + 1) === expected;
}

/* Returns a 401 response when the request is not an authenticated admin,
   or null when the request may proceed. */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(token)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/* Removes sensitive keys and hashes a new adminPassword before the
   settings write reaches the database. Mutates and returns the input. */
export async function prepareSettingsWrite(
  settings: Record<string, unknown>
): Promise<Record<string, string>> {
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(settings)) {
    if (SENSITIVE_SETTING_KEYS.includes(key)) continue;
    if (typeof value === "string") clean[key] = value;
  }
  if (typeof settings.adminPassword === "string" && settings.adminPassword) {
    const secret = await getAdminSecret();
    clean.adminPassword = await hashPassword(settings.adminPassword, secret);
  }
  return clean;
}

/* Strips sensitive keys before settings are returned to any client. */
export function stripSensitiveSettings(
  settings: { key: string; value: string }[]
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const s of settings) {
    if (!SENSITIVE_SETTING_KEYS.includes(s.key)) map[s.key] = s.value;
  }
  return map;
}
