'use client'

import { appRoutes } from "@/app-routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSocket } from "@/hooks/use-socket"
import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, Loader, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export const QueueJobStatus = {
  todo: 'todo',
  processing: 'processing',
  completed: 'completed',
  cancelled: 'cancelled'
} as const

const key = 'import-leads';
type ImportLeadSocketEvent = {
  listId: string,
  progress?: number,
  total?: number,
  processed?: number,
  status: 'in-progress' | 'done' | 'starting',
}

const DONE_STATUS = [QueueJobStatus.completed, QueueJobStatus.cancelled] as any

export const Client = ({ listId, queueId }: { listId: string, queueId: string }) => {
  const trpc = useTRPC();
  const { data: queue } = useQuery(trpc.queue.getQueueById.queryOptions({ queueId }))
  const { data: list } = useQuery(trpc.list.getListById.queryOptions({ listId }))
  const [stats, setStats] = useState<ImportLeadSocketEvent>()
  const calculatePercentage = (processed: number, total: number) => {
    return Math.floor((processed / total) * 100)
  }

  useSocket([key], {
    onEvent: {
      [key]: (event: ImportLeadSocketEvent) => {
        if (event.listId === listId) {
          setStats(event)
        }
      }
    }
  })

  if ((queue && DONE_STATUS.includes(queue?.status)) || stats?.status === 'done') {
    return <Success leadCount={stats ? (stats?.processed || 0) : (list?._count.leads || 0)} listId={listId} />
  }
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Import Summary</CardTitle>
        <CardDescription>
          Import in progress...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-8">
          <div className="flex justify-center">
            <Loader className="h-12 w-12 text-primary animate-spin" />
          </div>
          <div className="space-y-3">
            <Progress value={calculatePercentage(stats?.processed || 0, stats?.total || 0)} className="h-3" />
            <p className="text-center text-muted-foreground">
              {!stats ? "Please wait..." : (
                <>
                  Importing... <span className="font-medium text-foreground">{(stats?.processed || 0).toLocaleString()}</span>{" "}
                  / {(stats?.total || 0).toLocaleString()} leads collected
                </>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


function Success({ leadCount, listId }: { leadCount: number, listId: string }) {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Import Summary</CardTitle>
        <CardDescription>
          Import completed successfully!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Import Complete!</h3>
            <p className="text-muted-foreground">
              Successfully imported {leadCount.toLocaleString()} leads.
            </p>
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href={{ pathname: appRoutes.appLeads, query: { listId } }}>
                View Leads
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}