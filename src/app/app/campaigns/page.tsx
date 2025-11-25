import { Campaigns } from "@/components/pages/campaigns";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";



export default function CampaignsPage() {
  // prefetch(trpc.campaign.count.queryOptions())

  return <HydrateClient>
    <Campaigns />
  </HydrateClient>
}