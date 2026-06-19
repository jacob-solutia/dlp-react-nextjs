import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Next.js 16 renamed the `middleware` convention to `proxy`. This runs before a
// route renders, so it's where we do a fast, optimistic auth gate.
//
// We only check whether a session *cookie* exists — not whether it's valid.
// That keeps the proxy quick (no DB call). The real check happens in the
// dashboard layout via `auth.api.getSession`, which is the actual security
// boundary. This is the recommended better-auth + Next.js pattern.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isAuthed = Boolean(sessionCookie);
  const { pathname } = request.nextUrl;

  // Send signed-out visitors to /login, remembering where they were headed.
  if (pathname.startsWith("/dashboard") && !isAuthed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Keep signed-in users off the login page.
  if (pathname === "/login" && isAuthed) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login"],
};
