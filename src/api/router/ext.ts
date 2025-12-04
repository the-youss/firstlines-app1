
import { LinkedinClient } from "@/Linkedin-API";
import type { TRPCRouterRecord } from "@trpc/server";
import md5 from 'md5';
import z from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";

export const extensionRouter = {
  syncLinkedinSession: protectedProcedure
    .input(z.object({
      cookies: z.object({
        li_a: z.string(),
        li_at: z.string(),
        JSESSIONID: z.string()
      }).partial(),
      headers: z.array(z.object({
        name: z.string(),
        value: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const client = new LinkedinClient({
        cookies: input.cookies,
        linkedinHeaders: input.headers,
      })
      const status = Boolean(await client.profile.getOwnProfile()) ? 'active' : 'inactive';
      await ctx.db.linkedInSession.upsert({
        create: {
          userId: ctx.session.user.id,
          cookies: input.cookies,
          headers: input.headers,
          status,
          lastCheckedAt: new Date(),
        },
        update: {
          cookies: input.cookies,
          headers: input.headers,
          status,
          lastCheckedAt: new Date(),
        },
        where: {
          userId: ctx.session.user.id,
        }
      })
      return null
    }),
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
