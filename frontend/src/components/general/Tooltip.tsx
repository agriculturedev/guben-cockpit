import {TooltipProvider, TooltipTrigger, Tooltip, TooltipContent} from "@/components/ui/tooltip";
import { cn } from "@/utilities/twMerge";
import { ReactNode } from "@tanstack/react-router";

export const CustomTooltip = ({children, className, text}: {children: ReactNode, className?: string, text: string}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild className={cn("", className)}>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
