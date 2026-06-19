import { auth } from "@/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Catch-all handler for every better-auth endpoint (sign-in, sign-out,
// session, etc.) under /api/auth/*.
export const { GET, POST } = toNextJsHandler(auth);
