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
      id: '0cddbe8f-fbaa-4a6b-afa9-fc84df5a655c'
    }
  })
  if (!session) {
    return;
  }

  const linkedinClient = new LinkedinClient({
    cookies: session.cookies as LinkedinCookies,
    userId: "",
    linkedinHeaders: session.headers as LinkedinHeaders,
  })

  const r = await linkedinClient.profile.getProfile({
    profileHash: 'ACwAABiWRIUBXGYH8X9ys3fz8WI9-2NGX4jwImo'
  })
  console.log(r)
}

run()