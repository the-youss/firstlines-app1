import { Leads } from "@/components/pages/leads";
import { Suspense } from "react";


export const dynamic = "force-static";

export default function LeadsPage() {
  return (
    <Suspense>
      <Leads />
    </Suspense>
  )
}