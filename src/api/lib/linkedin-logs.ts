import { db, Prisma } from "@/lib/db";

export const linkedinLogs = async (userId: string, url: string, success?: Prisma.JsonObject, error?: Prisma.JsonObject) => {
  const now = new Date();
  await db.linkedinAPILogs.create({
    data: {
      date: now,
      time: now,
      url,
      error,
      response: success,
      userId
    }
  })
}