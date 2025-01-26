import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils";

export const LoadingIndicator = ({className}: { className?: string }) => {
  return <Loader2Icon className={cn(
    "h-4 w-4 animate-spin",
    className
  )}/>
}
