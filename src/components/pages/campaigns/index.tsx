
'use client'
import { Button } from "@/components/ui/button";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CreateNewCampaigns } from "./create-new-campaigns";
import { CampaignsTable } from "./table";

type SortKey = 'name' | 'title' | 'company' | 'country' | 'industry' | 'source' | 'list';
type SortDirection = 'asc' | 'desc' | null;

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  country: string;
  industry: string;
  source: string;
  list: string;
  campaign: string | null;
  avatar: string;
  linkedinUrl: string;
}

export const Campaigns = () => {
  const trpc = useTRPC()
  const campaignCount = 1
  // const { data: campaignCount } = useSuspenseQuery(trpc.campaign.count.queryOptions());
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const leads: Lead[] = [
    {
      id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      name: "Sarah Johnson",
      title: "VP of Sales",
      company: "TechCorp Inc",
      country: "United States",
      industry: "Technology",
      source: "LinkedIn",
      list: "Q1 Prospects",
      campaign: "Tech Leaders Outreach",
      avatar: "SJ",
      linkedinUrl: "https://linkedin.com/in/sarahjohnson",
    },
    {
      id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
      name: "Michael Chen",
      title: "Marketing Director",
      company: "Growth Labs",
      country: "Canada",
      industry: "Marketing",
      source: "Sales Nav",
      list: "Marketing List",
      campaign: null,
      avatar: "MC",
      linkedinUrl: "https://linkedin.com/in/michaelchen",
    },
    {
      id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
      name: "Emily Rodriguez",
      title: "CEO",
      company: "Startup XYZ",
      country: "United Kingdom",
      industry: "SaaS",
      source: "CSV",
      list: "Founders",
      campaign: "Founder Series",
      avatar: "ER",
      linkedinUrl: "https://linkedin.com/in/emilyrodriguez",
    },
    {
      id: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
      name: "David Kim",
      title: "CTO",
      company: "Innovation Co",
      country: "Singapore",
      industry: "Technology",
      source: "LinkedIn",
      list: "Tech Executives",
      campaign: null,
      avatar: "DK",
      linkedinUrl: "https://linkedin.com/in/davidkim",
    },
    {
      id: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b",
      name: "Lisa Anderson",
      title: "Head of Operations",
      company: "Global Enterprises",
      country: "Australia",
      industry: "Finance",
      source: "LinkedIn",
      list: "Q1 Prospects",
      campaign: null,
      avatar: "LA",
      linkedinUrl: "https://linkedin.com/in/lisaanderson",
    },
    {
      id: "f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c",
      name: "James Wilson",
      title: "Sales Manager",
      company: "RetailPro",
      country: "Germany",
      industry: "Retail",
      source: "CSV",
      list: "Marketing List",
      campaign: "Tech Leaders Outreach",
      avatar: "JW",
      linkedinUrl: "https://linkedin.com/in/jameswilson",
    },
  ];




  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            {campaignCount} campaign{campaignCount === 1 ? "" : "s"} found
          </p>
        </div>
        <CreateNewCampaigns />
      </div>

      <CampaignsTable />
    </div>
  );
};

