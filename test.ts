import 'dotenv/config'
import { StartExtractionProps } from "@/interface/StartExtractionProps"
import { db, Prisma } from "@/lib/db"
import { LinkedinClient } from "@/Linkedin-API"
import fs from 'fs'
import { ExtractionQueueInput } from '@/interface/ExtractionQueueInput'
import { Job } from '@/Linkedin-API/entities/jobs.entity'
import { resolveDomain } from '@/lib/company.utils'



const run = async () => {
  const queueJob = await db.queueJob.findUnique({
    where: {
      id: "7917eb3a-b479-406c-a327-7c464407a3a9"
    }
  })
  if (!queueJob) {
    return
  }
  const props = queueJob.input as unknown as ExtractionQueueInput
  const url = props.linkedinPayload.url
  const lk = new LinkedinClient({
    cookies: props.linkedinPayload.cookies,
    linkedinHeaders: props.linkedinPayload.headers
  })
  const searchResult = await lk.salesnavSearch.scrapeSearchResult(url,
    async (args) => {
      const companies = args.scrapedLeads.map(c => c.currentJobs).reduce((p, c) => {
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
      }, new Map<string, Job>);

      await db.company.createMany({
        data: Array.from(companies.values()).map<Prisma.CompanyCreateManyInput>(c => ({
          domain: c.companyWebsite!,
          name: c.companyName!,
          size: c.companySize,
          industry: c.industry,
          linkedinUrl: c.companyLinkedinUrl
        })),
        skipDuplicates: true
      });
      const companyIds = await db.company.findMany({
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
      const companyMap = new Map(companyIds.map(c => [c.domain, c.id]))

      const input = args.scrapedLeads.map<Prisma.LeadCreateManyInput>(({ lead, currentJobs }) => ({
        firstName: lead.firstName,
        lastName: lead.lastName,
        listId: props.list.id,
        city: lead.city,
        country: lead.country,
        companyId: currentJobs?.companyWebsite ? companyMap.get(resolveDomain(currentJobs.companyWebsite)) : undefined,
        industry: lead?.industry,
        linkedinHash: lead.profileHash,
        jobTitle: lead.jobTitle,
        linkedinId: lead.linkedinId,
        isLinkedinPremium: lead.isLinkedinPremium,
      }))
      await db.lead.createMany({
        data: input,
      })
      return true
    }
  )
  console.log('searchResult', searchResult)
}

run()