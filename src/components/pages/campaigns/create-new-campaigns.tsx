
'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { appRoutes } from "@/app-routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const CreateNewCampaigns = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createCampaign } = useMutation(trpc.campaign.create.mutationOptions({
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: (data) => {
      setIsDialogOpen(false);
      router.push(appRoutes.appCampaignSetup.replace(":campaignId", data.id));
    }
  }))
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");

  const handleCreateCampaign = () => {
    setLoading(true);
    createCampaign({ name: campaignName })
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Give your campaign a name to get started
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              placeholder="e.g., Q1 Sales Outreach"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateCampaign()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateCampaign} disabled={!campaignName.trim() || loading}>
            {loading ? `Please wait...` : "Continue to Setup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}