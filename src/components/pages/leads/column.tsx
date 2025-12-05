import { RouterOutputs } from "@/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, ExternalLink } from "@/components/ui/button"
import { MRT_ColumnDef } from "material-react-table"
import { Rows } from "./table"
import { $Enums } from "@/lib/db"
import { createHeading } from "@/lib/utils"
import { getLinkedinProfileUrlFromHash } from "@/lib/linkedin.utils"



export const useLeadsColumn = (): MRT_ColumnDef<Rows>[] => {
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
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs">
                {props.row.original.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{props.row.original.firstName}</p>
              {props.row.original.linkedinHash && (
                <a
                  href={getLinkedinProfileUrlFromHash(props.row.original.linkedinHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  LinkedIn <ExternalLink className="h-3 w-3" href={''} />
                </a>
              )}
            </div>
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
            <p className="font-medium">{props.row.original.jobTitle}</p>
            <p className="text-sm text-muted-foreground">{props.row.original.company?.name || props.row.original.company?.domain}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'country',
      header: 'Country',
      Cell(props) {
        return (
          <span className="text-sm">{props.row.original.country}</span>
        )
      },
    },
    {
      accessorKey: 'industry',
      header: 'Industry',
      Cell(props) {
        return (
          <span className="text-sm">{props.row.original.industry}</span>
        )
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      Cell(props) {
        return (
          <Badge variant="outline" className={getSourceBadge(props.row.original.source)}>
            {createHeading(props.row.original.source)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'list',
      header: 'List',
      Cell(props) {
        return (
          <Badge variant="secondary" className="capitalize">{props.row.original.list.name}</Badge>
        )
      },
    },
    {
      accessorKey: 'campaign',
      header: 'Active Campaign',
      Cell(props) {
        return props.row.original.campaign.length ? (
          <Button variant="link" className="h-auto p-0 text-primary">
            {props.row.original.campaign.map((campaign) => campaign.name).join(', ')}
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        )
      },
    },
  ]
}