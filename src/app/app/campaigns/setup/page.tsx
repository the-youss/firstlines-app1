import { appRoutes } from "@/app-routes";
import { redirect } from "next/navigation";

export default function CampaignSetupPage() {
  return redirect(appRoutes.appCampaigns)
}