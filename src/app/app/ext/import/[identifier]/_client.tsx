'use client'

import { appRoutes } from "@/app-routes";
import { ImportReview } from "@/components/ext/import-review";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Home, Loader2 } from "lucide-react";
import Link from "next/link";


export function Client({ identifier }: { identifier: string }) {
  const trpc = useTRPC();
  const { data: sourceData, isPending, error } = useQuery(
    trpc.extraction.fetchMeta.queryOptions({ payloadId: identifier })
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-112px)]">
      {isPending ? <Loading /> : error ? <Error message={error.message} /> : (
        <div className="w-full max-w-2xl">
          <ImportReview identifier={identifier} sourceData={sourceData!} />
        </div>
      )}
    </div >
  )
}


function Loading() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-112px)]">
      <Spinner className="size-10" />
      <span className="ml-2">Please wait while we fetch the metadata...</span>
    </div>
  )
}

function Error({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-112px)]">
      <AlertCircle className="size-10" />
      <span className="ml-2">{message}</span>
      <Button variant='secondary' asChild>
        <Link href={appRoutes.appDashboard}>
          <Home /> Go to dashboard
        </Link>
      </Button>
    </div>
  )
}


