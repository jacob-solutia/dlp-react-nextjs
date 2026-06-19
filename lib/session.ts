import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

// The security boundary for mutations. Server Actions are POST endpoints that
// can be invoked directly, independent of page/proxy protection, so each action
// must verify the session itself. Redirects to /login if there's no session.
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session;
}
