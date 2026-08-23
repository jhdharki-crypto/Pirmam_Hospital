/* Admin JWT token system using Node.js crypto (no external library needed).
   Tokens are created on login and verified by middleware on every admin API request. */

import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/* Secret key for signing tokens. In production, use an env variable.
   This secret is unique per deployment. */
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "pirmam-hospital-secret-key-2025";

/* Token expiry: 24 hours */
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

/* Create a signed token: "timestamp.signature.hex"
   The signature is HMAC-SHA256 of the timestamp using the secret key. */
export function createAdminToken(): string {
  const timestamp = Date.now().toString(36);
  const nonce = randomBytes(16).toString("hex");
  const payload = `${timestamp}.${nonce}`;
  const signature = createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

/* Verify a token. Returns true if valid and not expired. */
export function verifyAdminToken(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [timestampB36, _nonce, signature] = parts;
    const payload = `${timestampB36}.${_nonce}`;
    const expected = createHmac("sha256", TOKEN_SECRET)
      .update(payload)
      .digest("hex");

    /* Timing-safe comparison to prevent timing attacks */
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }

    /* Check expiry */
    const timestamp = parseInt(timestampB36, 36);
    if (Date.now() - timestamp > TOKEN_EXPIRY_MS) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
