import { LinkedinHeaders, LinkedinCookies } from "@/interface/LinkedinCookies";
import { db } from "@/lib/db"
import { LinkedinClient, } from "@/Linkedin-API";
import cron from "node-cron";

const shouldCheckInterval = 2 * 24 * 60 * 1000; // 2 days in milliseconds

const checkLinkedInCookieStatus = async () => {
  const linkedInSessions = await db.linkedInSession.findMany({
    where: {
      status: 'active',
    }
  })

  for (const session of linkedInSessions) {
    if (session.updatedAt.getTime() > Date.now() - shouldCheckInterval) {
      const client = new LinkedinClient({
        userId: session.userId,
        cookies: session.cookies as LinkedinCookies,
        linkedinHeaders: session.headers as LinkedinHeaders,
      })
      const status = Boolean(await client.profile.getOwnProfile()) ? 'active' : 'inactive';
      await db.linkedInSession.update({
        where: {
          id: session.id,
        },
        data: {
          status,
        }
      })
    }
  }
}


export const checkLinkedInCookieStatusCron = async () => {
  cron.schedule('0 */6 * * *', () => {
    checkLinkedInCookieStatus()
  }, { name: "Check LinkedIn Cookie Status", noOverlap: true });
}