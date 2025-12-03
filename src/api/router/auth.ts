
import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

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
    return lkSession ? lkSession.status : 'inactive';
  }),
} satisfies TRPCRouterRecord;
