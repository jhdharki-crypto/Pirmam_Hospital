/* Admin token system using Web Crypto API (works in both Edge Runtime and Node.js).
   Tokens are created on login and verified by middleware on every admin API request. */

/* Secret key for signing tokens. In production, use an env variable. */
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "pirmam-hospital-secret-key-2025";

/* Token expiry: 24 hours */
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

/* Simple but effective token: base64(timestamp + "." + secret-hash)
   Uses the global crypto.subtle (Web Crypto API) which works in Edge Runtime. */

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* Create a signed token (async because of Web Crypto) */
export async function createAdminToken(): Promise<string> {
  const timestamp = Date.now().toString(36);
  const nonce = crypto.getRandomValues(new Uint8Array(8)).join("");
  const payload = `${timestamp}.${nonce}`;
  const signature = await hashString(`${payload}.${TOKEN_SECRET}`);
  return `${payload}.${signature}`;
}

/* Verify a token synchronously (for middleware). Checks format and expiry.
   HMAC verification happens async in route handlers; middleware does lightweight check. */
export function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [timestampB36] = parts;
    const timestamp = parseInt(timestampB36, 36);

    if (isNaN(timestamp)) return false;
    if (Date.now() - timestamp > TOKEN_EXPIRY_MS) return false;
    if (timestamp > Date.now() + 60000) return false; /* Not from the future */

    /* Basic signature format check (must be 64 hex chars = SHA-256) */
    const signature = parts[2];
    if (!/^[a-f0-9]{64}$/.test(signature)) return false;

    return true;
  } catch {
    return false;
  }
}

/* Full async verification with HMAC (use in route handlers, not middleware) */
export async function verifyAdminTokenFull(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [timestampB36, nonce, signature] = parts;
    const payload = `${timestampB36}.${nonce}`;
    const expected = await hashString(`${payload}.${TOKEN_SECRET}`);

    if (signature !== expected) return false;

    const timestamp = parseInt(timestampB36, 36);
    if (Date.now() - timestamp > TOKEN_EXPIRY_MS) return false;

    return true;
  } catch {
    return false;
  }
}
