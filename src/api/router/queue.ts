
import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";
import { DEFAULT_LINKEDIN_SESSION_INTERVAL } from "@/lib/utils";
import { $Enums, Prisma } from "@/lib/db";
import { LinkedinClient } from "@/Linkedin-API";
import { LinkedinCookies, LinkedinHeaders } from "@/interface/LinkedinCookies";
import z from "zod";

export const queueRouter = {
  getQueueById: publicProcedure.input(z.object({ queueId: z.string() })).query(({ ctx, input }) => {
    return ctx.db.queueJob.findUnique({ where: { id: input.queueId } })
  }),

} satisfies TRPCRouterRecord;
