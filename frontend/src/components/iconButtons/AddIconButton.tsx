import { PlusIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/general/Tooltip";

interface AddIconButtonProps {
  tooltip: string;
  disabledTooltip?: string;
  dialogTrigger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const AddIconButton = ({tooltip, disabledTooltip, onClick, dialogTrigger = false, disabled = false}: AddIconButtonProps) => {
  return (
    <CustomTooltip text={disabled ? disabledTooltip ?? "" : tooltip}>
      {dialogTrigger
        ? (
          disabled
            ? <PlusIcon className={"hover:bg-hover hover:shadow rounded p-1.5 stroke-gray-300"} size={"2rem"}/>
            : <DialogTrigger asChild>
              <PlusIcon className={"text-[#cd1421] hover:bg-hover hover:shadow rounded p-1.5"} size={"2rem"}/>
            </DialogTrigger>
        )

        : <PlusIcon className={"text-[#cd1421] hover:bg-hover hover:shadow rounded p-1.5"} size={"2rem"} onClick={onClick}/>
      }
    </CustomTooltip>
  );
};
