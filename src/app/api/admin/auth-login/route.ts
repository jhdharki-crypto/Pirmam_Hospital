import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAdminToken } from "@/lib/admin-token";

/* POST /api/admin/auth-login
   Verifies password and sets an httpOnly cookie with a signed token.
   This cookie is sent automatically by the browser on all subsequent requests. */
export async function POST(request: NextRequest) {
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

    if (!setting || setting.value !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    /* Create signed token */
    const token = createAdminToken();

    /* Set httpOnly cookie (cannot be read by JavaScript, prevents XSS theft) */
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
