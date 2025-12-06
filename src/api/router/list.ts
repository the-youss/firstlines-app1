
import { db, Prisma } from "@/lib/db";
import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";
import { protectedProcedure } from "../trpc";
import { LeadSchema, LeadsSchema } from "@/lib/lead.utils";
import { resolveDomain } from "@/lib/company.utils";
import set from "lodash/set";

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
    limit: z.number().min(1).max(100).optional().default(50),
    listId: z.string().optional(),
    sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional()
  })).query(async ({ ctx, input }) => {
    const { q, page = 1, limit = 10 } = input;
    const skip = (page - 1) * limit;
    let orderBy: Prisma.LeadOrderByWithRelationInput = {}

    const filter: Prisma.LeadWhereInput = {
      list: {
        user: {
          id: ctx.session.user.id
        }
      },
    };
    if (q) {
      const keys = ['firstName', 'lastName', 'industry', "country", 'city','jobTitle'] as (keyof Prisma.LeadWhereInput)[];
      filter.OR = keys.map(key => ({
        [key]: {
          contains: q,
          mode: "insensitive"
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
    if (input.listId) {
      filter.listId = input.listId
    }

    if (input.sorting) {
      orderBy = input.sorting.reduce((acc, sort) => {
        const direction = sort.desc ? 'desc' : 'asc';

        // build nested object: "company.name" → { company: { name: 'asc' } }
        set(acc, sort.id, direction);

        return acc;
      }, {} as Prisma.LeadOrderByWithRelationInput);
    }

    const rows = await ctx.db.lead.findMany({
      where: filter,
      orderBy,
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

  getLists: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.list.findMany({
      where: {
        userId: ctx.session.user.id
      }
    })
  }),

  getListById: protectedProcedure.input(z.object({ listId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.list.findUnique({
      where: {
        id: input.listId,
      },
      include: {
        _count: {
          select: {
            leads: true
          }
        }
      }
    })
  }),

  importLeads: protectedProcedure
    .input(z.object({
      listName: z.string(),
      leads: LeadsSchema
    })).mutation(async ({ ctx, input }) => {
      const { listName, leads: _leads } = input
      const companies = _leads.reduce((p, c) => {
        if (!c) {
          return p
        }
        const domain = c?.companyWebsite ? resolveDomain(c.companyWebsite) : undefined;
        if (!domain) {
          return p
        }
        c.companyWebsite = domain;
        p.set(domain, c)
        return p
      }, new Map<string, LeadSchema>);

      await ctx.db.company.createMany({
        data: Array.from(companies.values()).map<Prisma.CompanyCreateManyInput>(c => ({
          domain: c.companyWebsite!,
          name: c.companyName!,
          size: c.companySize,
          industry: c.industry,
          linkedinUrl: c.companyLinkedinUrl
        })),
        skipDuplicates: true
      });
      const companyIds = await ctx.db.company.findMany({
        where: {
          domain: {
            in: Array.from(companies.keys())
          }
        },
        select: {
          id: true,
          domain: true
        }
      })
      const list = await ctx.db.list.create({
        data: {
          name: listName,
          user: {
            connect: {
              id: ctx.session.user.id
            }
          }
        }
      })
      const companyMap = new Map(companyIds.map(c => [c.domain, c.id]))
      await ctx.db.lead.createMany({
        data: _leads.map<Prisma.LeadCreateManyInput>(lead => ({
          connection: lead.connection,
          firstName: lead.firstName,
          lastName: lead.lastName,
          headline: lead.headline,
          linkedinHash: lead.profileHash,
          linkedinId: lead.linkedinId,
          listId: list.id,
          companyId: lead.companyWebsite ? companyMap.get(resolveDomain(lead.companyWebsite)) : undefined,
          birthDate: lead.birthday,
          city: lead.city,
          country: lead.country,
          educations: lead.educations,
          industry: lead.industry,
          isLinkedinPremium: lead.isLinkedinPremium,
          openToWork: lead.openToWork,
          jobTitle: lead.jobTitle,
          source: "manual_entry",
        }))
      })

      return { listId: list.id }
    }),

  importSingleLead: protectedProcedure
    .input(z.object({
      listId: z.string().optional(),
      listName: z.string().optional(),
      lead: LeadSchema
    })).mutation(async ({ ctx, input }) => {
      const { lead, listId: _listId, listName } = input

      const listId = _listId ? _listId : (await ctx.db.list.create({
        data: {
          userId: ctx.session.user.id,
          name: listName!
        }
      })).id;

      const domain = lead?.companyWebsite ? resolveDomain(lead.companyWebsite) : undefined;
      if (!domain) {
        return
      }
      const company = await ctx.db.company.upsert({
        where: {
          domain: domain
        },
        update: {},
        create: {
          domain: domain,
          name: lead.companyName!,
          size: lead.companySize,
          industry: lead.industry,
          linkedinUrl: lead.companyLinkedinUrl
        }
      });

      await ctx.db.lead.create({
        data: {
          connection: lead.connection,
          firstName: lead.firstName,
          lastName: lead.lastName,
          headline: lead.headline,
          linkedinHash: lead.profileHash,
          linkedinId: lead.linkedinId,
          listId: listId,
          companyId: company.id,
          birthDate: lead.birthday,
          city: lead.city,
          country: lead.country,
          educations: lead.educations,
          industry: lead.industry,
          isLinkedinPremium: lead.isLinkedinPremium,
          openToWork: lead.openToWork,
          jobTitle: lead.jobTitle,
          source: "manual_entry",
        }
      })

      return { listId }
    })
} satisfies TRPCRouterRecord;
