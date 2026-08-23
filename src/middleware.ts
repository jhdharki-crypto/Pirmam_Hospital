import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-token";

/* Routes that are publicly accessible (no auth needed) */
const PUBLIC_ADMIN_ROUTES = [
  "/api/admin/auth-check",
  "/api/admin/auth-attempt",
  "/api/admin/auth-login",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Only intercept /api/admin/* routes */
  if (!pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  /* Allow public admin routes (login, rate limiting) */
  if (PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  /* Check for auth token cookie */
  const token = request.cookies.get("pirmam-auth")?.value;

  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/admin/:path*",
};
