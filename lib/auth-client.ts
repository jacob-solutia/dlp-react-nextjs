import { createAuthClient } from "better-auth/react";

// Client-side auth helpers. Students use these in the sign-in page and the
// sign-out button (Step 10). baseURL defaults to the current origin.
export const authClient = createAuthClient();

export const { signIn, signOut, signUp, useSession } = authClient;
