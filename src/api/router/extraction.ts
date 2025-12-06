
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
          message: 'Something went wrong Plese import again.',
        })
      }
      const props = payload.payload as unknown as StartExtractionProps
      const client = new LinkedinClient({
        cookies: props.cookies,
        userId: ctx.session.user.id,
        linkedinHeaders: props.headers,
      });
      const searchResult = await client.salesnavSearch.fetchMetas(props.url)
      return searchResult.status !== 400 ? {
        leadCount: searchResult.paging.total,
        title: searchResult.metadata?.searchTitle,
        sourceURL: props.sourceURL,
        source: props.source
      } : null
    }),
  startSalesNavExtraction: protectedProcedure
    .input(z.object({
      payloadId: z.string(),
      listName: z.string().optional(),
      listId: z.string().optional(),
      campaignId: z.string().optional(),
      destination: z.enum(['campaign', 'existing-list', 'new-list'])
    }))
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

      let listId = '';
      if (input.destination === 'new-list' && input.listName) {
        const list = await ctx.db.list.create({
          data: {
            name: input.listName,
            userId: ctx.session.user.id,
          }
        })
        listId = list.id
      } else if (input.destination === 'existing-list' && input.listId) {
        const list = await ctx.db.list.findUnique({
          where: {
            id: input.listId
          }
        })
        if (!list) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'There is no such list.',
          })
        }
        listId = list.id
      } else if (input.destination === 'campaign' && input.campaignId) {
        const campaign = await ctx.db.campaign.findUnique({
          where: {
            id: input.campaignId
          }
        })
        if (!campaign) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'There is no such campaign.',
          })
        }
        listId = campaign.listId!
        if (input.listName) {
          const list = await ctx.db.list.create({
            data: {
              name: input.listName,
              userId: ctx.session.user.id,
            }
          })
          listId = list.id
        }
      }
      if (!listId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Something went wrong."
        })
      }
      const list = await ctx.db.list.findUnique({
        where: {
          id: listId
        }
      })
      const queue = await ctx.db.queueJob.create({
        data: {
          input: { list, linkedinPayload: payload.payload, shouldAddToCampaign: input.destination === 'campaign' },
          type: QueueJobType.sales_nav_extraction,
          userId: ctx.session.user.id,
          logs: [`Added to queue at ${getServerUTCDate()}`],
        }
      })
      return { queue, listId }
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
