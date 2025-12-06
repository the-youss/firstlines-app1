import { appRoutes } from "@/app-routes";
import { redirect } from "next/navigation";
import { Client } from "./_client";


export default async function Page({ params }: { params: Promise<{ listId: string; identifier: string }> }) {
  const p = await params
  const listId = p.listId;
  const identifier = p.identifier;
  if (!listId) {
    return redirect(appRoutes.appLeads)
  }
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-112px)]">
      <Client listId={listId} queueId={identifier} />
    </div>
  )
}