'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from "lucide-react";
import { MRT_TableInstance } from "material-react-table";
import { useRef, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useLeadsColumn } from "./column";
import { RouterOutputs } from "@/api";

export interface Lead {
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

type APIResponse = RouterOutputs['list']['leads']
export type Rows = APIResponse['rows'][number]
type LeadsTableProps = APIResponse & { isLoading: boolean }
export function LeadsTable({ rows, count }: LeadsTableProps) {
  const columns = useLeadsColumn()
  const [loading, setLoading] = useState(false);
  const [onRowSelectionChange, setOnRowSelectionChange] = useState<number>(0)
  const ref = useRef<{ table: MRT_TableInstance<Rows> }>(null)



  return (
    <DataTable<Rows>
      ref={ref}
      toolbar={[
        {
          node: <RightAction table={ref.current?.table} rowChange={onRowSelectionChange} />,
          position: "2nd-left"
        }
      ]}
      calcHeight="366px"
      data={rows}
      onRowSelectionChange={() => setOnRowSelectionChange(state => state + 1)}
      onPaginationChange={(pagination) => console.log(pagination)}
      columns={columns} />
  )
}


function RightAction({ table, rowChange }: { table?: MRT_TableInstance<any>, rowChange: number }) {
  const selectedRows = table?.getSelectedRowModel().rows;
  if (!selectedRows?.length) {
    return null
  }
  return (
    <div className="flex items-center gap-3" key={rowChange}>
      <p className="text-sm font-medium text-primary">{selectedRows.length} selected</p>
      <Button variant="outline" size="sm" onClick={() => { }}>
        <Plus className="mr-2 h-4 w-4" />
        Add to Campaign
      </Button>
      <DeleteSelectedLeadsDialog rows={selectedRows} />
    </div>
  )
}




export function DeleteSelectedLeadsDialog({ rows }: { rows: any[] }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" onClick={() => { }}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
