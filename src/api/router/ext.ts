
import type { TRPCRouterRecord } from "@trpc/server";
import md5 from 'md5';
import z from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";
import { headers } from "next/headers";

export const extensionRouter = {
  createPayload: publicProcedure
    .input(z.object({
      payload: z.object({
        url: z.string(),
        headers: z.array(z.object({
          name: z.string(),
          value: z.string(),
        })),
        cookies: z.object({
          li_a: z.string(),
          li_at: z.string(),
          JSESSIONID: z.string()
        }).partial()
      })
    }))
    .mutation(async ({ ctx, input }) => {
      const hash = md5(JSON.stringify(input.payload))
      const payload = await ctx.db.extensionPayload.upsert({
        create: {
          userId: '3cb5147b-8ded-43e4-b89a-0552db8f82b4',
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
