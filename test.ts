import 'dotenv/config'
import { StartExtractionProps } from "@/interface/StartExtractionProps"
import { db, LeadSource, Prisma } from "@/lib/db"
import { LinkedinClient } from "@/Linkedin-API"
import fs, { writeFileSync } from 'fs'
import { ExtractionQueueInput } from '@/interface/ExtractionQueueInput'
import { Job } from '@/Linkedin-API/entities/jobs.entity'
import { resolveDomain } from '@/lib/company.utils'
import { LinkedinCookies, LinkedinHeaders } from '@/interface/LinkedinCookies'



const run = async () => {
  const session = await db.extensionPayload.findUnique({
    where: {
      id: 'cmiur3yeo0005qcs59014zv4p'
    }
  })
  if (!session) {
    return;
  }
  const payload = session.payload as unknown as StartExtractionProps
  const linkedinClient = new LinkedinClient({
    cookies: payload.cookies as LinkedinCookies,
    userId: session.userId,
    linkedinHeaders: payload.headers as LinkedinHeaders,
  })
  const s = await linkedinClient.salesnavSearch.scrapeSearchResult(payload.url, async () => {
    return true
  })
  // const r = await linkedinClient.profile.getProfile({
  //   profileHash: 'ACwAABiWRIUBXGYH8X9ys3fz8WI9-2NGX4jwImo'
  // })
  console.log(s)
}

run()