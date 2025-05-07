import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ReactNode } from "@tanstack/react-router";

export const CustomTooltip = ({ children, className, text }: { children: ReactNode, className?: string, text: string }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild className={cn("", className)}>
          {children}
        </TooltipTrigger>
        {text &&
          <TooltipContent>
            <p>{text}</p>
          </TooltipContent>
        }
      </Tooltip>
    </TooltipProvider>
  )
}
