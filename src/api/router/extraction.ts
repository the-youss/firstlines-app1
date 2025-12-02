
import { Prisma, QueueJobStatus, QueueJobType } from "@/lib/db";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { protectedProcedure } from "../trpc";
import { getServerUTCDate } from "@/lib/utils";

export const extractionRouter = {
  startSalesNavExtraction: protectedProcedure
    .input(z.object({ payloadId: z.string() }))
    .mutation(async ({ ctx, input, }) => {
      const payload = await ctx.db.extensionPayload.findUnique({
        where: {
          id: input.payloadId,
        },
      });

      if (!payload) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'There is something wrong with the payload',
        })
      }
      return ctx.db.queueJob.create({
        data: {
          input: payload.payload as Prisma.JsonObject,
          type: QueueJobType.sales_nav_extraction,
          userId: ctx.session.user.id,
          logs: [`Extraction add to queue at ${getServerUTCDate()}`],
        }
      })
    }),
  cancelSalesNavExtraction: protectedProcedure
    .input(z.object({ queueId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const queue = await ctx.db.queueJob.findUnique({
        where: {
          id: input.queueId,
        },
      });

      if (!queue) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Queue not found',
        })
      }

      return ctx.db.queueJob.update({
        where: {
          id: input.queueId,
        },
        data: {
          status: QueueJobStatus.cancelled,
          logs: {
            push: `Extraction cancelled at ${getServerUTCDate()}`
          }
        }
      })
    }),
} satisfies TRPCRouterRecord;
