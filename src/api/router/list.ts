
import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc";

export const campaignRouter = {
  count: protectedProcedure.query(({ ctx }) => {
    return ctx.db.list.count({
      where: {
        user: {
          id: ctx.session.user.id
        }
      }
    })
  }),
} satisfies TRPCRouterRecord;
