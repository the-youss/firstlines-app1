import { authRouter } from "./router/auth";
import { campaignRouter } from "./router/campaign";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  campaign: campaignRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;