
import { Prisma } from "@/lib/db";
import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { protectedProcedure } from "../trpc";

export const listRouter = {
  count: protectedProcedure.query(({ ctx }) => {
    return ctx.db.list.count({
      where: {
        user: {
          id: ctx.session.user.id
        }
      }
    })
  }),
  leads: protectedProcedure.input(z.object({
    q: z.string().optional(),
    page: z.number().min(1).optional().default(1),
    limit: z.number().max(100).optional().default(10),
  })).query(async ({ ctx, input }) => {
    const { q, page = 1, limit = 10 } = input;
    const skip = (page - 1) * limit;
    const filter: Prisma.LeadWhereInput = {
      list: {
        user: {
          id: ctx.session.user.id
        }
      },
    };
    if (q) {
      const keys = ['firstName', 'lastName', 'industry', "country", 'city'] as (keyof Prisma.LeadWhereInput)[];
      filter.OR = keys.map(key => ({
        [key]: {
          contains: q,
        },
      }))
      const key2 = ['name', 'domain', 'size'] as (keyof Prisma.CompanyWhereInput)[];
      filter.OR.push(...key2.map(key => ({
        company: {
          [key]: {
            contains: q,
          },
        },
      })))
    }

    const rows = await ctx.db.lead.findMany({
      where: filter,
      skip,
      take: limit,
      include: {
        list: {
          select: {
            id: true,
            name: true,
          }
        },
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          }
        },
        campaign: {
          select: {
            id: true,
            name: true,
          }
        },
      }
    })
    const count = await ctx.db.lead.count({
      where: filter,
    })

    return {
      rows,
      count,
    }
  }),
} satisfies TRPCRouterRecord;
