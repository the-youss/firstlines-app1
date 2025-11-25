
'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { DataTableDemo2 } from "@/components/data-table/demo2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, Plus, Search, Trash2, Upload, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { LeadsTable } from "./table";

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

export const Leads = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((lead) =>
        lead.name.toLowerCase().includes(lowerSearch) ||
        lead.title.toLowerCase().includes(lowerSearch) ||
        lead.company.toLowerCase().includes(lowerSearch) ||
        lead.country.toLowerCase().includes(lowerSearch) ||
        lead.industry.toLowerCase().includes(lowerSearch) ||
        lead.source.toLowerCase().includes(lowerSearch) ||
        lead.list.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply sorting
    if (sortKey && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortKey].toLowerCase();
        const bValue = b[sortKey].toLowerCase();

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortKey, sortDirection]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(filteredLeads.map((lead) => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    const newSelected = new Set(selectedLeads);
    if (checked) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleDeleteSelected = () => {
    // Logic to delete selected leads
    setSelectedLeads(new Set());
  };

  const handleAddToCampaign = () => {
    // Logic to add selected leads to campaign
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction or clear
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-1 h-3 w-3 inline-block opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp className="ml-1 h-3 w-3 inline-block" />;
    return <ArrowDown className="ml-1 h-3 w-3 inline-block" />;
  };

  const getSourceBadge = (source: string) => {
    const colors = {
      LinkedIn: "bg-blue-100 text-blue-800",
      "Sales Nav": "bg-purple-100 text-purple-800",
      CSV: "bg-green-100 text-green-800",
    };
    return colors[source as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const allVisibleSelected = filteredLeads.length > 0 && filteredLeads.every((lead) => selectedLeads.has(lead.id));
  const someSelected = selectedLeads.size > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"} found
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Import Leads
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Import Leads</DialogTitle>
              <DialogDescription>
                Add new leads to your database via CSV upload or manual entry
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="csv">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              <TabsContent value="csv" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="list-name">Import to List</Label>
                  <Input id="list-name" placeholder="Enter list name" />
                </div>
                <Button className="w-full">Upload & Import</Button>
              </TabsContent>
              <TabsContent value="manual" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input id="linkedin" placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input id="title" placeholder="VP of Sales" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Acme Corp" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="list">Add to List</Label>
                    <Input id="list" placeholder="Enter list name" />
                  </div>
                </div>
                <Button className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between gap-4">

        {someSelected && (
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2">
            <p className="text-sm font-medium text-primary">{selectedLeads.size} selected</p>
            <Button variant="outline" size="sm" onClick={handleAddToCampaign}>
              <Plus className="mr-2 h-4 w-4" />
              Add to Campaign
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <LeadsTable />
    </div>
  );
};

