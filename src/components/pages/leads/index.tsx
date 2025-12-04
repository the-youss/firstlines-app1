
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
import { ImportLeadsDialog } from "./import-leads-dialog";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

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
  const trpc = useTRPC();
  const [query, setQuery] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 50 })
  const searchParams = useSearchParams()
  const { data, isLoading } = useQuery(
    trpc.list.leads.queryOptions({
      q: query || '',
      page: pagination.page === 0 ? 1 : pagination.page || 1,
      limit: pagination.limit || 50,
    })
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            {data?.count || 0} {data?.count === 1 ? "lead" : "leads"} found
          </p>
        </div>
        <ImportLeadsDialog>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Leads
          </Button>
        </ImportLeadsDialog>
      </div>

      <LeadsTable count={data?.count || 0} rows={data?.rows || []} isLoading={isLoading} setQuery={setQuery} setPagination={setPagination} />
    </div>
  );
};

