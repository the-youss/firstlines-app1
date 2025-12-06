import { RouterOutputs } from "@/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, ExternalLink } from "@/components/ui/button"
import { MRT_ColumnDef } from "material-react-table"
import { Rows } from "./table"
import { $Enums } from "@/lib/db"
import { createHeading } from "@/lib/utils"
import { getLinkedinProfileUrlFromHash } from "@/lib/linkedin.utils"
import { format } from "date-fns"
import Link from "next/link"
import { appRoutes } from "@/app-routes"



export const useListTableColumn = (): MRT_ColumnDef<Rows>[] => {
  const getSourceBadge = (source: $Enums.LeadSource) => {
    const colors: Record<$Enums.LeadSource, string> = {
      'linkedin_search': "bg-blue-100 text-blue-800",
      "sales_nav": "bg-purple-100 text-purple-800",
      'manual_entry': "bg-green-100 text-green-800",
    };
    return colors[source as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      filterFn: 'fuzzy',
      Cell(props) {
        return (
          <div className="flex items-center gap-3">
            <Link href={{ pathname: appRoutes.appLeads, query: { listId: props.row.original.id } }} className="font-medium text-primary hover:underline line-clamp-2 text-ellipsis text-pretty">
              {props.row.original.name}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: 'title',
      header: 'Title & Company',
      Cell(props) {
        return (
          <div>
            linkeind
            {/* <Badge className={getSourceBadge(props.row.original.source)} variant="secondary">
              {props.row.original.source}
            </Badge> */}
          </div>
        )
      },
    },
    {
      accessorKey: '_count.leads',
      header: 'Lead Count',
      Cell(props) {
        return (
          <span>{props.row.original._count.leads}</span>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell(props) {
        return (
          <span className="text-sm text-muted-foreground">
            {format(props.row.original.createdAt, "MMM d, yyyy")}
          </span>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Active Campaign',
      Cell(props) {
        return (
          <span className="text-sm text-muted-foreground">
            {format(props.row.original.createdAt, "MMM d, yyyy")}
          </span>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'Action',
      Cell(props) {
        return (
          <span className="text-sm text-muted-foreground">
            {format(props.row.original.createdAt, "MMM d, yyyy")}
          </span>
        )
      },
    },
  ]
}