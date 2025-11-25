import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MRT_ColumnDef } from "material-react-table"

export const useCampaignsColumn = (): MRT_ColumnDef<any>[] => {
  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-success/10 text-success border-success/20",
      Paused: "bg-amber-100 text-amber-700 border-amber-200",
      Draft: "bg-muted text-muted-foreground border-border",
      Completed: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return variants[status as keyof typeof variants] || "";
  };
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      filterFn: 'fuzzy',
      Cell(props) {
        return (
          <p className="font-medium">{props.row.original.name}</p>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell(props) {
        return (
          <Badge variant="outline" className={getStatusBadge(props.row.original.status)}>
            {props.row.original.status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'leadsCount',
      header: 'Leads Count',
      Cell(props) {
        return (
          <span className="font-medium">{props.row.original.leadsCount.toLocaleString()}</span>
        )
      },
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      Cell(props) {
        return (
          <div className="flex items-center gap-2">
            <Progress value={props.row.original.progress} className="h-2 w-24" />
            <span className="text-sm text-muted-foreground">{props.row.original.progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'connectRate',
      header: 'Connect Rate',
      Cell(props) {
        return (
          <span className="font-medium">{props.row.original.connectRate}%</span>
        )
      },
    },
    {
      accessorKey: 'replyRate',
      header: 'Reply Rate',
      Cell(props) {
        return (
          <span className="font-medium">{props.row.original.replyRate}%</span>
        )
      },
    },
  ]
}