'use client'

import { appRoutes } from "@/app-routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function Client({ identifier }: { identifier: string }) {
  const trpc = useTRPC();
  const router = useRouter()
  const { data: meta, isPending: isPendingMetadta } = useQuery(trpc.extraction.fetchMeta.queryOptions({ payloadId: identifier }));
  const singleLead = meta?.total === 1 ? 'lead' : 'leads';
  const { mutate: importLeads, isPending } = useMutation(trpc.extraction.startSalesNavExtraction.mutationOptions({
    onSuccess() {
      toast.info(`Import in progress...`)
      router.replace(appRoutes.appDashboard)
    },
  }))

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('listName') as string;
    importLeads({ payloadId: identifier, name })
  }, [identifier])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isPendingMetadta ? <Loading /> : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Import {meta?.total} {singleLead}</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Enter list name:</Label>
                  <Input
                    id="listName"
                    type="text"
                    name="listName"
                    placeholder="My Leads"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end mt-8">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Importing...' : 'Import'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div >
  )
}


function Loading() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <Spinner className="size-10" />
      <span className="ml-2">Please wait while we fetch the metadata...</span>
    </div>
  )
}