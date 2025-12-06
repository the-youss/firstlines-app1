import { authRouter } from "./router/auth";
import { campaignRouter } from "./router/campaign";
import { extensionRouter } from "./router/ext";
import { extractionRouter } from "./router/extraction";
import { listRouter } from "./router/list";
import { queueRouter } from "./router/queue";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  campaign: campaignRouter,
  extension: extensionRouter,
  extraction: extractionRouter,
  list: listRouter,
  queue: queueRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;