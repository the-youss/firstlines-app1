
import { LinkedinClient } from "@/Linkedin-API";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import md5 from 'md5';
import z from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";
import { LinkedinCookies, LinkedinHeaders } from "@/interface/LinkedinCookies";
import { $Enums, LeadSource } from "@/lib/db";
import { resolveDomain } from "@/lib/company.utils";

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
        userId: ctx.session.user.id,
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
      return { success: true }
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
        }).partial(),
        sourceURL: z.string()
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

  getLists: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.list.findMany({
      where: {
        userId: ctx.session.user.id
      }
    })
  }),

  importSingleProfile: protectedProcedure.input(z.object({
    listId: z.string().optional(),
    listName: z.string().optional(),
    source: z.enum($Enums.LeadSource),
    identifier: z.string()
  }).refine((input) => {
    return Boolean(input.listId || input.listName)
  }, {
    message: "Either listId or listName is required"
  })).mutation(async ({ ctx, input }) => {
    const session = await ctx.db.linkedInSession.findUnique({
      where: {
        userId: ctx.session.user.id,
        status: 'active',
      }
    })
    if (!session) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'LinkedIn session not found',
      })
    }
    const linkedinClient = new LinkedinClient({
      userId: ctx.session.user.id,
      cookies: session.cookies as LinkedinCookies,
      linkedinHeaders: session.headers as LinkedinHeaders,
    })

    const profile = await linkedinClient.profile.getProfile({
      profileHash: input.identifier,
    })
    const lead = profile?.lead;
    if (!lead) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'LinkedIn profile not found',
      })
    }

    const listId = input.listId ? input.listId : await ctx.db.list.create({
      data: {
        name: input.listName!,
        userId: ctx.session.user.id,
      }
    }).then((list) => list.id);
    let companyId: string | undefined = undefined;
    if (lead.companyLinkedinUrl) {
      const dbCompany = await ctx.db.company.findFirst({
        where: {
          linkedinUrl: lead.companyLinkedinUrl
        }
      })
      if (dbCompany) {
        companyId = dbCompany.id;
      } else {
        const companyRes = await linkedinClient.company.getCompany({ universalName: lead.companyLinkedinUrl.split("/").filter(Boolean).pop()! })
        const domain = companyRes?.websiteUrl ? resolveDomain(companyRes.websiteUrl) : null
        if (domain) {
          const companyData = {
            name: lead?.companyName!,
            industry: lead?.industry,
            size: lead?.companySize,
            domain,
            linkedinUrl: lead?.companyLinkedinUrl,
          }
          const company = await ctx.db.company.upsert({
            create: companyData,
            update: companyData,
            where: { domain: companyData.domain }
          })
          companyId = company.id;

        }
      }
    }
    const data = {
      firstName: lead?.firstName,
      lastName: lead?.lastName,
      industry: lead?.industry,
      connection: lead.connection,
      listId,
      linkedinHash: lead?.profileHash || '',
      isLinkedinPremium: lead?.isLinkedinPremium,
      jobTitle: lead?.jobTitle,
      birthDate: lead.birthday,
      source: input.source,
      city: lead?.city,
      country: lead?.country,
      companyId,
      educations: lead.educations?.map(e => ({
        degree: e.degree || '',
        fieldsOfStudy: e.fieldsOfStudy.filter(Boolean),
        schoolName: e.schoolName || '',
      })),
      headline: lead.headline,
      linkedinId: lead.linkedinId,
      openToWork: lead.openToWork,
    };
    await ctx.db.lead.upsert({
      create: data,
      update: data,
      where: {
        linkedinHash_listId: {
          linkedinHash: data.linkedinHash,
          listId: data.listId,
        }
      }
    })

    return { listId }
  })
} satisfies TRPCRouterRecord;
