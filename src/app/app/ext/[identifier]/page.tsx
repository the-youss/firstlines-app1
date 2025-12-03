import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Client } from "./_client";
import { Suspense } from "react";


export default async function Page({ params }: { params: Promise<{ identifier: string }> }) {
  const { identifier } = await params;
  return (
    <Client identifier={identifier} />
  )
}