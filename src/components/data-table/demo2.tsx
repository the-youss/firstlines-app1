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
import { DataTable } from ".";
import { Button } from "../ui/button";
import { data } from "./makeData";

type TableState = 'leads' | 'lists'

export function DataTableDemo2({ calcHeight }: { calcHeight: `${number}px` }) {
  const [loading, setLoading] = useState(false);
  const [_data, setData] = useState<any[]>(data)
  const [onRowSelectionChange, setOnRowSelectionChange] = useState<number>(0)
  const ref = useRef<{ table: MRT_TableInstance<any> }>(null)



  return (
    <DataTable
      ref={ref}
      toolbar={[
        {
          node: <RightAction table={ref.current?.table} rowChange={onRowSelectionChange} />,
          position: "2nd-left"
        }
      ]}
      calcHeight={calcHeight}
      data={_data}
      onRowSelectionChange={() => setOnRowSelectionChange(state => state + 1)}
      columns={[
        {

          accessorKey: 'name',
          header: 'Name',
          filterFn: 'fuzzy',
        },
        {
          accessorKey: 'title',
          header: 'Title & Company',
          meta: {
            sortable: false,
          }
        },
        {
          accessorKey: 'country',
          header: 'Country',

        },
        {
          accessorKey: 'industry',
          header: 'Industry',
        },
        {
          accessorKey: 'source',
          header: 'Source',
        },
        {
          accessorKey: 'list',
          header: 'List',
        },
        {
          accessorKey: 'campaign',
          header: 'Active Campaign',
        },

      ]} />
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
