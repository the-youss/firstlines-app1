
import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { protectedProcedure } from "../trpc";

export const campaignRouter = {
  count: protectedProcedure.query(({ ctx }) => {
    return ctx.db.campaign.count({
      where: {
        user: {
          id: ctx.session.user.id
        }
      }
    })
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.campaign.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id
            }
          },
          name: input.name,
        },
      });
    }),
} satisfies TRPCRouterRecord;
