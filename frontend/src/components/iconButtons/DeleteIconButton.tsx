import { CustomTooltip } from "@/components/general/Tooltip";
import { DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";

interface DeleteIconButtonProps {
  tooltip: string;
  dialogTrigger: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  onClick?: () => void;
}

const IconButton = (props: { disabled?: boolean, onClick?: () => void }) => (
  <div
    onClick={props.disabled !== undefined && props.disabled ? undefined : props.onClick}
    className={cn("rounded-full p-1.5 border size-8", props.disabled
      ? "bg-gray-200 text-gray-400"
      : "text-red-500 bg-white hover:cursor-pointer hover:bg-gray-200"
    )}
  >
    <Trash2Icon className="size-full" />
  </div>
)

export const DeleteIconButton = ({tooltip, dialogTrigger, disabled, disabledTooltip, onClick}: DeleteIconButtonProps) => {
  return (
    <CustomTooltip text={disabled ? disabledTooltip ?? "" : tooltip}>
      {dialogTrigger
        ? (
          <DialogTrigger asChild>
            <IconButton {...{ disabled }} />
          </DialogTrigger>
        ) : <IconButton {...{ onclick, disabled }} />
      }
    </CustomTooltip>
  );
};
