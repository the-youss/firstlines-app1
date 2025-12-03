import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";
import { Environment } from "../environment";

const isProduction = Environment.isProduction()

export const auth = betterAuth({
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  // },
  // Allow requests from the frontend development server
  trustedOrigins: ['*'],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: isProduction ? undefined : 3,
    maxPasswordLength: isProduction ? undefined : 3,
    password: {
      hash: async (password) => {
        return hashPassword(password);
      },
      verify: async (data) => {
        console.log(data);
        return verifyPassword(data.password, data.hash);
      },
    },
  },
  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },
  onAPIError: {
    onError(error, ctx) {
      console.error("BETTER AUTH API ERROR", error, ctx);
    },
  },
});

export type Auth = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};


export const getSessionOnServer = async (): Promise<Auth | null> => {
  const response = await auth.api.getSession({
    headers: await headers()
  })
  return response
}
