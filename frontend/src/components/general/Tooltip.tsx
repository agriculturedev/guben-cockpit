import {TooltipProvider, TooltipTrigger, Tooltip, TooltipContent} from "@/components/ui/tooltip";


export const CustomTooltip = ({children, text}: {children: React.ReactNode, text: string}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
