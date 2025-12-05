
import { StartExtractionProps } from "@/interface/StartExtractionProps";
import { QueueJobStatus, QueueJobType } from "@/lib/db";
import { getServerUTCDate } from "@/lib/utils";
import { LinkedinClient } from "@/Linkedin-API";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { protectedProcedure } from "../trpc";

export const extractionRouter = {
  fetchMeta: protectedProcedure
    .input(z.object({ payloadId: z.string() }))
    .query(async ({ ctx, input, }) => {
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
      const props = payload.payload as unknown as StartExtractionProps
      const client = new LinkedinClient({
        cookies: props.cookies,
        userId: ctx.session.user.id,
        linkedinHeaders: props.headers,
      });
      const searchResult = await client.salesnavSearch.fetchMetas(props.url)
      return searchResult.status !== 400 ? searchResult.paging : null
    }),
  startSalesNavExtraction: protectedProcedure
    .input(z.object({ payloadId: z.string(), name: z.string() }))
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

      const list = await ctx.db.list.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        }
      })
      const queue = await ctx.db.queueJob.create({
        data: {
          input: { list, linkedinPayload: payload.payload },
          type: QueueJobType.sales_nav_extraction,
          userId: ctx.session.user.id,
          logs: [`Added to queue at ${getServerUTCDate()}`],
        }
      })
      return queue
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
            push: `Cancelled at ${getServerUTCDate()}`
          }
        }
      })
    }),
} satisfies TRPCRouterRecord;
