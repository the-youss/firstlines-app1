'use client'
import { RouterOutputs } from "@/api";
import { DataTable } from "@/components/data-table";
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
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { MRT_TableInstance } from "material-react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useLeadsColumn } from "./column";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

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

type APIResponse = RouterOutputs['list']['leads']
export type Rows = APIResponse['rows'][number]
type LeadsTableProps = {

}

export function LeadsTable(props: LeadsTableProps) {
  const columns = useLeadsColumn()
  const trpc = useTRPC();
  const [query, setQuery] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 50 })
  const { data, isLoading } = useQuery(
    trpc.list.leads.queryOptions({
      q: query || '',
      page: pagination.page === 0 ? 1 : pagination.page || 1,
      limit: pagination.limit || 50,
    })
  )
  const [onRowSelectionChange, setOnRowSelectionChange] = useState<number>(0)
  const ref = useRef<{ table: MRT_TableInstance<Rows> }>(null)


  const _pagination = useCallback(() => {
    const pagination = ref.current?.table.getState().pagination;
    setPagination({ page: pagination?.pageIndex || 1, limit: pagination?.pageSize || 20 })
  }, [setPagination])

  return (
    <DataTable<Rows>
      count={data?.count || 0}
      loading={isLoading}
      ref={ref}
      toolbar={[
        {
          node: <RightAction table={ref.current?.table} rowChange={onRowSelectionChange} />,
          position: "2nd-left"
        }
      ]}
      calcHeight="366px"
      data={data?.rows || []}
      onRowSelectionChange={() => setOnRowSelectionChange(state => state + 1)}
      onPaginationChange={() => {
        setTimeout(_pagination, 0)
      }}
      onGlobalFilterChange={(value) => {
        setQuery(value)
        setPagination({ page: 1, limit: 50 })
      }}
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
