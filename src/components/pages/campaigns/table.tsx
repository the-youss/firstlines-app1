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
import { Pause, Plus, Trash2 } from "lucide-react";
import { MRT_TableInstance } from "material-react-table";
import { useRef, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useCampaignsColumn } from "./column";



const campaigns = [
  {
    id: 1,
    name: "Tech Leaders Outreach",
    status: "Active",
    leadsCount: 2450,
    progress: 65,
    connectRate: 74,
    replyRate: 41,
  },
  {
    id: 2,
    name: "Founder Series",
    status: "Paused",
    leadsCount: 1823,
    progress: 42,
    connectRate: 68,
    replyRate: 38,
  },
  {
    id: 3,
    name: "Marketing Directors Q1",
    status: "Draft",
    leadsCount: 0,
    progress: 0,
    connectRate: 0,
    replyRate: 0,
  },
  {
    id: 4,
    name: "Sales VP Campaign",
    status: "Completed",
    leadsCount: 3102,
    progress: 100,
    connectRate: 72,
    replyRate: 45,
  },
  {
    id: 5,
    name: "Enterprise Outbound",
    status: "Active",
    leadsCount: 1567,
    progress: 78,
    connectRate: 81,
    replyRate: 52,
  },
  {
    id: 6,
    name: "Product Launch Campaign",
    status: "Paused",
    leadsCount: 890,
    progress: 23,
    connectRate: 65,
    replyRate: 34,
  },
];

export function CampaignsTable() {
  const columns = useCampaignsColumn()
  const [loading, setLoading] = useState(false);
  const [_data, setData] = useState<any[]>(campaigns)
  const [onRowSelectionChange, setOnRowSelectionChange] = useState<number>(0)
  const ref = useRef<{ table: MRT_TableInstance<any> }>(null)



  return (
    <DataTable
      density="spacious"
      ref={ref}
      toolbar={[
        {
          node: <RightAction table={ref.current?.table} rowChange={onRowSelectionChange} />,
          position: "2nd-left"
        }
      ]}
      calcHeight="366px"
      data={_data}
      onRowSelectionChange={() => setOnRowSelectionChange(state => state + 1)
      }
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
      <Button variant="outline" size="sm" onClick={()=>{}}>
        <Pause className="mr-2 h-4 w-4" />
        Pause
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
