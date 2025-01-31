import { PencilIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/general/Tooltip";

interface EditIconButtonProps {
  tooltip: string;
  disabledTooltip?: string;
  dialogTrigger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const EditIconButton = ({tooltip, disabledTooltip, onClick, dialogTrigger = false, disabled = false}: EditIconButtonProps) => {
  return (
    <CustomTooltip text={disabled ? disabledTooltip ?? "" : tooltip}>

      {dialogTrigger
        ? (<DialogTrigger asChild>
          <PencilIcon className={"hover:bg-hover hover:shadow rounded p-1.5"} size={"2rem"}/>
        </DialogTrigger>)
        : <PencilIcon className={"hover:bg-hover hover:shadow rounded p-1.5"} size={"2rem"} onClick={onClick}/>
      }
    </CustomTooltip>

  );
};
