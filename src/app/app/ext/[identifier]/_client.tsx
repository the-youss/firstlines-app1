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

interface SourceData {
  sourceUrl: string;
  sourceType: "linkedin" | "sales-nav";
  leadCount: number;
}


const MOCK_CAMPAIGNS = [
  { id: "camp-1", name: "Tech Leaders Outreach" },
  { id: "camp-2", name: "Q1 Sales Push" },
  { id: "camp-3", name: "Enterprise Accounts" },
];
const MOCK_SOURCE: SourceData = {
  sourceUrl: "https://www.linkedin.com/search/results/people/?keywords=sales%20manager&origin=GLOBAL_SEARCH_HEADER",
  sourceType: "linkedin",
  leadCount: 1340,
};
type ImportDestination = "new-list" | "campaign" | "existing-list";
type ImportState = "review" | "processing" | "success";

export function Client({ identifier }: { identifier: string }) {
  const trpc = useTRPC();
  const router = useRouter()
  const { data: meta, isPending: isPendingMetadta } = useQuery(trpc.extraction.fetchMeta.queryOptions({ payloadId: identifier }));
  const singleLead = meta?.total === 1 ? 'lead' : 'leads';


  // Source data from Chrome extension or mock
  const sourceData: SourceData = MOCK_SOURCE;

  // Import state
  // const [state, setState] = useState<ImportState>("review");
  // const [progress, setProgress] = useState(0);
  // const [importedCount, setImportedCount] = useState(0);

  // // Reset relevant fields when destination changes
  // useEffect(() => {
  //   if (destination === "new-list") {
  //     setListName(`Search Results - ${new Date().toLocaleDateString()}`);
  //   }
  //   setSelectedCampaignId("");
  //   setSelectedListId("");
  //   setCreateNewSegment(false);
  //   setSegmentName("");
  // }, [destination]);

  // Processing simulation
  // useEffect(() => {
  //   if (state === "processing") {
  //     const interval = setInterval(() => {
  //       setProgress((prev) => {
  //         const increment = Math.random() * 8 + 2;
  //         const newProgress = Math.min(prev + increment, 100);
  //         setImportedCount(Math.floor((newProgress / 100) * sourceData.leadCount));

  //         if (newProgress >= 100) {
  //           clearInterval(interval);
  //           setTimeout(() => setState("success"), 500);
  //         }
  //         return newProgress;
  //       });
  //     }, 200);

  //     return () => clearInterval(interval);
  //   }
  // }, [state, sourceData.leadCount]);









  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-112px)]">
      {false ? <Loading /> : (
        <div className="w-full max-w-2xl">
          <Review identifier={identifier} />
        </div>
      )}
    </div >
  )
}


function Loading() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <Spinner className="size-10" />
      <span className="ml-2">Please wait while we fetch the metadata...</span>
    </div>
  )
}


function Review({ identifier }: { identifier: string }) {
  const router = useRouter();
  const trpc = useTRPC();
  const sourceData: SourceData = MOCK_SOURCE;
  const { data: lists } = useQuery(trpc.extension.getLists.queryOptions())
  // const { data: meta, isPending: isPendingMetadta } = useQuery(trpc.extraction.fetchMeta.queryOptions({ payloadId: identifier }));
  const [destination, setDestination] = useState<ImportDestination>("new-list");
  const [listName, setListName] = useState(`Search Results - ${new Date().toLocaleDateString()}`);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [createNewSegment, setCreateNewSegment] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const { mutate: importLeads, isPending } = useMutation(trpc.extraction.startSalesNavExtraction.mutationOptions({
    onSuccess() {
      toast.info(`Import in progress...`)
      router.replace(appRoutes.appDashboard)
    },
  }))

  const handleSubmit = useCallback(() => {
    console.log('submit', destination, identifier, listName, selectedCampaignId, selectedListId)
  }, [identifier, destination, listName, selectedCampaignId, selectedListId])

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

  const SourceIcon =
    'sales-nav' === "sales-nav" ? (
      <div className="h-12 w-12 rounded-xl bg-[#0A66C2] flex items-center justify-center">
        <span className="text-white font-bold text-lg">SN</span>
      </div>
    ) : (
      <div className="h-12 w-12 rounded-xl bg-[#0A66C2] flex items-center justify-center">
        <Linkedin className="h-6 w-6 text-white" />
      </div>
    );
  const getDestinationIcon = () => {
    if (destination === "campaign") {
      return (
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Megaphone className="h-6 w-6 text-primary" />
        </div>
      );
    }
    return (
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <List className="h-6 w-6 text-primary" />
      </div>
    );
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
            {SourceIcon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={sourceData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline flex items-center gap-1 text-foreground"
                >
                  {sourceData.sourceType === "sales-nav"
                    ? "Sales Navigator Results"
                    : "LinkedIn Search Results"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground truncate">{sourceData.sourceUrl}</p>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {sourceData.leadCount.toLocaleString()} leads found
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
                {getDestinationIcon()}
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
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                        placeholder={`Import - ${new Date().toLocaleDateString()}`}
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
            <Button variant="outline" className="flex-1" onClick={router.back}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!isImportValid()}>
              Start Import
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}