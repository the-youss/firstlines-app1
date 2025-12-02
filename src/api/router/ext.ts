
import type { TRPCRouterRecord } from "@trpc/server";
import md5 from 'md5';
import z from "zod";
import { protectedProcedure } from "../trpc";

export const extensionRouter = {
  generatePayload: protectedProcedure
    .input(z.object({ payload: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const hash = md5(JSON.stringify(input.payload))
      const payload = await ctx.db.extensionPayload.upsert({
        create: {
          userId: ctx.session.user.id,
          hash,
          payload: input.payload,
        },
        update: {
          payload: input.payload,
        },
        where: {
          hash
        }
      })
      return { identifier: payload.id }
    }),

  getPayload: protectedProcedure
    .input(z.object({ identifier: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.extensionPayload.findUnique({
        where: {
          id: input.identifier,
        }
      })
    }),
} satisfies TRPCRouterRecord;
