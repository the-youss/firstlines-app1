
import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";
import { DEFAULT_LINKEDIN_SESSION_INTERVAL } from "@/lib/utils";
import { $Enums, Prisma } from "@/lib/db";
import { LinkedinClient } from "@/Linkedin-API";
import { LinkedinCookies, LinkedinHeaders } from "@/interface/LinkedinCookies";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  checkLinkedinSessionStatus: protectedProcedure.query(async ({ ctx }) => {
    const lkSession = await ctx.db.linkedInSession.findUnique({
      where: {
        userId: ctx.session.user.id
      }
    })
    let currentStatus: $Enums.LinkedInSessionStatus = lkSession?.status ?? 'inactive';
    const shouldCheck = lkSession?.lastCheckedAt ? Date.now() - lkSession.lastCheckedAt.getTime() >= DEFAULT_LINKEDIN_SESSION_INTERVAL : true;
    if (lkSession && shouldCheck) {
      const client = new LinkedinClient({
        cookies: lkSession.cookies as LinkedinCookies,
        linkedinHeaders: lkSession.headers as LinkedinHeaders,
      })
      const status = Boolean(await client.profile.getOwnProfile()) ? 'active' : 'inactive';

      await ctx.db.linkedInSession.update({
        where: {
          id: lkSession.id,
        },
        data: {
          status,
          lastCheckedAt: new Date(),
        }
      })
      currentStatus = status
    }
    return currentStatus
  }),
} satisfies TRPCRouterRecord;
