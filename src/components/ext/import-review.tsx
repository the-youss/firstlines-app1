'use client'

import { appRoutes } from "@/app-routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Linkedin,
  ArrowDown,
  List,
  Megaphone,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RouterOutputs } from "@/api";

const MOCK_CAMPAIGNS = [
  { id: "camp-1", name: "Tech Leaders Outreach" },
  { id: "camp-2", name: "Q1 Sales Push" },
  { id: "camp-3", name: "Enterprise Accounts" },
];
type ImportDestination = "new-list" | "campaign" | "existing-list";
type SourceData = RouterOutputs['extraction']['fetchMeta']

export function ImportReview({ sourceData, identifier }: { sourceData: SourceData, identifier: string }) {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: lists } = useQuery(trpc.list.getLists.queryOptions())
  const [destination, setDestination] = useState<ImportDestination>("new-list");
  const [listName, setListName] = useState(sourceData?.title ?? `Search Results - ${new Date().toLocaleDateString()}`);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [createNewSegment, setCreateNewSegment] = useState(false);


  const { mutate: importLeads, isPending } = useMutation(trpc.extraction.startSalesNavExtraction.mutationOptions({
    onSuccess(data) {
      router.replace(appRoutes.appImportProgress.replace(":identifier", data.queue.id).replace(":listId", data.listId))
    },
  }))

  const handleSubmit = useCallback(() => {
    importLeads({
      payloadId: identifier,
      campaignId: selectedCampaignId,
      listId: selectedListId,
      listName: destination === 'new-list' || createNewSegment ? listName : undefined,
      destination
    })
  }, [identifier, destination, listName, selectedCampaignId, selectedListId, createNewSegment])

  const isImportValid = () => {
    switch (destination) {
      case "new-list":
        return listName.trim().length > 0;
      case "campaign":
        return selectedCampaignId !== "";
      case "existing-list":
        return selectedListId !== "";
      default:
        return false;
    }
  };


  const getDestinationLabel = () => {
    switch (destination) {
      case "new-list":
        return listName || "New List";
      case "campaign":
        const campaign = MOCK_CAMPAIGNS.find((c) => c.id === selectedCampaignId);
        return campaign ? campaign.name : "Select a campaign";
      case "existing-list":
        const list = lists?.find((l) => l.id === selectedListId);
        return list ? list.name : "Select a list";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Summary</CardTitle>
        <CardDescription>
          Choose where to send your leads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Source Section */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <div className="h-12 w-12 rounded-xl bg-[#0A66C2] flex items-center justify-center">
              {sourceData?.source === 'sales_nav' ? <span className="text-white font-bold text-lg">SN</span> : <Linkedin className="h-6 w-6 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={sourceData?.sourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline flex items-center gap-1 text-foreground"
                >
                  {'sales-nav' === "sales-nav"
                    ? "Sales Navigator Results"
                    : "LinkedIn Search Results"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground truncate">{sourceData?.sourceURL}</p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {sourceData?.leadCount.toLocaleString()} leads found
            </Badge>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Destination Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Choose where to import leads</Label>
              <Select value={destination} onValueChange={(val) => setDestination(val as ImportDestination)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose where to import leads" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-list">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>New list</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="campaign">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      <span>Add to campaign</span>
                    </div>
                  </SelectItem>
                  {lists && lists.length > 0 && (
                    <SelectItem value="existing-list">
                      <div className="flex items-center gap-2">
                        <List className="h-4 w-4" />
                        <span>Existing list</span>
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Configuration Based on Selection */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {destination === "campaign" ? <Megaphone className="h-6 w-6 text-primary" /> : <List className="h-6 w-6 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{getDestinationLabel()}</p>
                  <p className="text-sm text-muted-foreground">
                    {destination === "new-list" && "Create a new list for these leads"}
                    {destination === "campaign" && "Add leads directly to a campaign"}
                    {destination === "existing-list" && "Merge leads into an existing list"}
                  </p>
                </div>
              </div>

              {/* New List Config */}
              {destination === "new-list" && (
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="list-name">List Name</Label>
                  <Input
                    id="list-name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name..."
                  />
                </div>
              )}

              {/* Campaign Config */}
              {destination === "campaign" && (
                <div className="space-y-4 pt-2 border-t">
                  <div className="space-y-2">
                    <Label>Select Campaign</Label>
                    <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a campaign..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_CAMPAIGNS.map((campaign) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="create-segment"
                      checked={createNewSegment}
                      onCheckedChange={(checked) => setCreateNewSegment(checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="create-segment" className="font-medium cursor-pointer">
                        Create a new list for this import?
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        If unchecked, leads will be merged into the campaign's existing main list.
                      </p>
                    </div>
                  </div>

                  {createNewSegment && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="segment-name">New List Name</Label>
                      <Input
                        id="segment-name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Existing List Config */}
              {lists && lists.length > 0 && destination === "existing-list" && (
                <div className="space-y-2 pt-2 border-t">
                  <Label>Select List</Label>
                  <Select value={selectedListId} onValueChange={setSelectedListId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a list..." />
                    </SelectTrigger>
                    <SelectContent>
                      {lists?.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => router.push(appRoutes.appDashboard)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!isImportValid() || isPending}>
              {isPending ? "Please wait..." : 'Start Import'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}