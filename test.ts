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
  const session = await db.linkedInSession.findUnique({
    where: {
      id: '1e7234a4-2ede-46e5-a887-b242ffc51f3a'
    }
  })
  if (!session) {
    return;
  }

  const linkedinClient = new LinkedinClient({
    cookies: session.cookies as LinkedinCookies,
    linkedinHeaders: session.headers as LinkedinHeaders,
  })

  const r = await linkedinClient.profile.getProfile({
    profileHash: 'jeanchristophebougle'
  })

  writeFileSync('profile.json', JSON.stringify(r, null, 2))
}

run()