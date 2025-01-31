import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/general/Tooltip";

interface DeleteIconButtonProps {
  tooltip: string;
  dialogTrigger: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  onClick?: () => void;
}

export const DeleteIconButton = ({tooltip, dialogTrigger, disabled, disabledTooltip, onClick}: DeleteIconButtonProps) => {
  return (
    <CustomTooltip text={disabled ? disabledTooltip ?? "" : tooltip}>
      {dialogTrigger
        ? (
          disabled
            ? <Trash2Icon className={"hover:bg-hover hover:shadow rounded p-1.5 stroke-gray-300"} size={"2rem"}/>
            : <DialogTrigger asChild>
              <Trash2Icon className={"text-[#cd1421] hover:bg-hover hover:shadow rounded p-1.5"} size={"2rem"}/>
            </DialogTrigger>
        )

        : <Trash2Icon className={"text-[#cd1421] hover:bg-hover hover:shadow rounded p-1.5"} size={"2rem"} onClick={onClick}/>
      }
    </CustomTooltip>

  );
};
