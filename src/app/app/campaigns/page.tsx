import { Campaigns } from "@/components/pages/campaigns";
import { prefetch, trpc } from "@/trpc/server";

export default function CampaignsPage() {
  prefetch(trpc.campaign.count.queryOptions())
  
  return <Campaigns />
}