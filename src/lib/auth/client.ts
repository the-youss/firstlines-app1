import { createAuthClient } from "better-auth/react";
import { type Auth } from '.';

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
  plugins: [],
})


export const { useSession } = authClient

export type AuthClient = Auth