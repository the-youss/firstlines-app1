import { cn } from "@/lib/utils"
import { Linkedin, TvIcon } from "lucide-react"

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Linkedin className={cn("h-6 w-6 text-primary", className)} />
  )
}