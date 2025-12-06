
'use client'
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ImportLeadsDialog } from "./import-leads-dialog";
import { ListsTable } from "./list/table";
import { LeadsTable } from "./table";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { appRoutes } from "@/app-routes";
import { useSocket } from "@/hooks/use-socket";

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
  useSocket(['test'], {
    onEvent: {
      'test': (data) => {
        console.log(data)
      }
    }
  })
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"leads" | "lists">("leads");
  const listId = searchParams.get('listId') || ''

  return (
    <div className="space-y-6">


      {listId ? (
        <ListPage listId={listId} />
      ) : (
        <LeadPage setActiveTab={setActiveTab} activeTab={activeTab} />
      )}
    </div>
  );
};

function ListPage({ listId }: { listId: string }) {
  const router = useRouter()
  const trpc = useTRPC();
  const { data: list, isLoading } = useQuery(trpc.list.getListById.queryOptions({ listId }))
  const leadsCount = list?._count.leads || 0
  return (
    <>
      <Button variant='outline' className="mb-6" onClick={() => router.push(appRoutes.appLeads)}>
        <ChevronLeft />
        Back to Lists
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-10 w-32" /> : list?.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            {isLoading ? <Skeleton className="h-4 w-10 inline-block" /> : leadsCount} {leadsCount === 1 ? "lead" : "leads"} in this list
          </p>
        </div>
        <ImportLeadsDialog>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Leads
          </Button>
        </ImportLeadsDialog>
      </div>
      <LeadsTable listId={listId} />
    </>
  )
}

function LeadPage({ activeTab, setActiveTab }: { activeTab: "leads" | "lists", setActiveTab: React.Dispatch<React.SetStateAction<"leads" | "lists">> }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Manage your leads and lists
          </p>
        </div>
        <ImportLeadsDialog>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Import Leads
          </Button>
        </ImportLeadsDialog>
      </div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "leads" | "lists")}>
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="leads">All Leads</TabsTrigger>
          <TabsTrigger value="lists" className="cursor-pointer">Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6">
          <LeadsTable />
        </TabsContent>

        <TabsContent value="lists" className="mt-6">
          <ListsTable />
        </TabsContent>
      </Tabs>
    </>
  )
}