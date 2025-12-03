import { authRouter } from "./router/auth";
import { campaignRouter } from "./router/campaign";
import { extensionRouter } from "./router/ext";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  campaign: campaignRouter,
  extension: extensionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;