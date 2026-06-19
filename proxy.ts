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

  // Signed-out visitors → /login, remembering where they were headed. We don't
  // touch /login here on purpose: since this is only a cookie check, a stale
  // cookie would bounce /login → /dashboard → (layout) → /login forever.
  if (pathname.startsWith("/dashboard") && !isAuthed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
