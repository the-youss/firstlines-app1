import { ExtractionQueueInput } from '@/interface/ExtractionQueueInput';
import { resolveDomain } from '@/lib/company.utils';
import { db, LeadSource, Prisma, QueueJob } from '@/lib/db';
import { getServerUTCDate } from '@/lib/utils';
import { LinkedinClient } from '@/Linkedin-API';
import { Job } from '@/Linkedin-API/entities/jobs.entity';
import Queue, { worker } from 'fastq';



const __WORKER__: worker<any, { queue: QueueJob }, boolean> = async (arg, cb) => {
  const queue = arg.queue;
  console.log('queueId', queue.id);
  try {
    const props = queue.input as unknown as ExtractionQueueInput
    const url = props.linkedinPayload.url
    const lk = new LinkedinClient({
      cookies: props.linkedinPayload.cookies,
      linkedinHeaders: props.linkedinPayload.headers
    })
    const success = await lk.salesnavSearch.scrapeSearchResult(url,
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
          connection: lead.connection,
          birthDate: lead.birthday,
          headline: lead.headline,
          openToWork: lead.openToWork,
          source: LeadSource.sales_nav,
          educations: lead.educations?.map(e => ({
            degree: e.degree,
            fieldsOfStudy: e.fieldsOfStudy,
            schoolName: e.schoolName,
          }))
        }))
        await db.lead.createMany({
          data: input,
          skipDuplicates: true
        })
        return true
      }
    )
    const leadCount = await db.lead.count({
      where: {
        listId: props.list.id
      }
    })
    await db.queueJob.update({
      where: { id: queue.id },
      data: {
        status: 'completed',
        isFailed: !success,
        lastMessage: success ? 'Completed successfully' : 'Something went wrong...',
        logs: {
          push: [
            `${success ? "Completed" : "Failed"} at ${getServerUTCDate()}`,
            `${leadCount} leads extracted`
          ]
        }
      }
    });
    cb(null, true)
  } catch (error) {
    console.error(`[WORKER SALES_NAV_EXTRACTION] ${(error as Error).message}`);
    await db.queueJob.update({
      where: { id: queue.id },
      data: {
        status: 'completed',
        isFailed: true,
        lastMessage: (error as Error).message,
        logs: { push: `Failed at ${getServerUTCDate()}` }
      }
    });

    cb(error as Error, false);
  }
}

const salesNavExtractionQueue = Queue(__WORKER__, 5);

export const addSalesNavExtractionJob = (queue: QueueJob) => {
  salesNavExtractionQueue.push({ queue })
}


async function checkSalesNavExtractionQueueWhenServerIsReady() {

  const queues = await db.queueJob.findMany({
    where: {
      type: 'sales_nav_extraction',
      status: {
        in: ['todo', 'processing'],
      },
    }
  });
  for (const queue of queues) {
    await db.queueJob.update({
      where: { id: queue.id },
      data: { status: 'processing', logs: { push: `[Server RestDarted] Resume at ${getServerUTCDate()}` } }
    })
    addSalesNavExtractionJob(queue)
  }
}


async function pollingSalesNavExtractionQueue() {

  const job = await db.queueJob.findFirst({
    where: { status: 'todo', type: 'sales_nav_extraction' }
  });
  if (job) {
    await db.queueJob.update({
      where: { id: job.id },
      data: { status: 'processing', logs: { push: `Started at ${getServerUTCDate()}` } }
    })
    addSalesNavExtractionJob(job)
  }
  setTimeout(pollingSalesNavExtractionQueue, 10_000)
}


export function initSalesNavExtractionQueue() {
  checkSalesNavExtractionQueueWhenServerIsReady()
  pollingSalesNavExtractionQueue()
}