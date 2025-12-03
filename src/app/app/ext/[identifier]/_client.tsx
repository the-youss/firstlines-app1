'use client'

import { useTRPC } from "@/trpc/react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export async function Client({ identifier }: { identifier: string }) {
  const trpc = useTRPC();
  const { data: meta } = useQuery(trpc.extraction.fetchMeta.queryOptions({ payloadId: identifier }));
  return (
    <div>
      <h1>{JSON.stringify(meta)}</h1>
    </div>
  )
}