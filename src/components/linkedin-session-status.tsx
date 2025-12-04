import { LINKEDIN_SALES_NAV_HOME_PAGE } from "@/lib/utils";
import { createQueryClient } from "@/trpc/query-client";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Linkedin } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";


export function LinkedInSessionStatus({ children }: { children?: (status: boolean) => React.ReactNode }) {
  const trpc = useTRPC()
  const { data: status, isPending } = useQuery(trpc.auth.checkLinkedinSessionStatus.queryOptions(), createQueryClient({ refetchOnWindowFocus: true }))
  const isLinkedInConnected = status === 'active';

  const _onClick = useCallback(() => {
    if (isLinkedInConnected === false) {
      window.open(`${LINKEDIN_SALES_NAV_HOME_PAGE}?from=fl_lk_status_check`, '_blank')
    }
  }, [isLinkedInConnected])

  if (children) {
    return children(isLinkedInConnected)
  }

  if (isPending) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50`}
      >
        <Spinner className="h-4 w-4" />
        <span className="text-sm font-medium">
          Checking linkedin status...
        </span>
      </Button>
    )
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={_onClick}
      className={`gap-2 ${isLinkedInConnected
        ? "text-green-600 hover:text-green-700 hover:bg-green-50"
        : "text-red-600 hover:text-red-700 hover:bg-red-50"
        }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${isLinkedInConnected ? "bg-green-600" : "bg-red-600"
          }`}
      />
      <Linkedin className="h-4 w-4" />
      <span className="text-sm font-medium">
        {isLinkedInConnected ? "Account Connected" : "Account Disconnected"}
      </span>
    </Button>
  )
}