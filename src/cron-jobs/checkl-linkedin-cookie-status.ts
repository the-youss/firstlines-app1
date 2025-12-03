import { LinkedinHeaders, LinkedinCookies } from "@/interface/LinkedinCookies";
import { db } from "@/lib/db"
import { LinkedinClient, } from "@/Linkedin-API";


const shouldCheckInterval = 2 * 24 * 60 * 1000; // 2 days in milliseconds

export const checkLinkedInCookieStatus = async () => {
  const linkedInSessions = await db.linkedInSession.findMany({
    where: {
      status: 'active',
    }
  })

  for (const session of linkedInSessions) {
    if (session.updatedAt.getTime() > Date.now() - shouldCheckInterval) {
      const client = new LinkedinClient({
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