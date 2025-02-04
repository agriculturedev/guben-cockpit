import { PencilIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/general/Tooltip";
import { cn } from "@/lib/utils";
import { WithClassName } from "@/types/WithClassName";

interface EditIconButtonProps extends WithClassName {
  tooltip: string;
  disabledTooltip?: string;
  dialogTrigger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const IconButton = (props: { disabled?: boolean, onClick?: () => void }) => (
  <div
    onClick={props.disabled !== undefined && props.disabled ? undefined : props.onClick}
    className={cn("rounded-full p-1.5 border size-8", props.disabled
      ? "bg-gray-200 text-gray-400"
      : "bg-white hover:cursor-pointer hover:bg-gray-200"
    )}
  >
    <PencilIcon className="size-full" />
  </div>
)

export const EditIconButton = ({ tooltip, disabledTooltip, onClick, className, dialogTrigger = false, disabled = false }: EditIconButtonProps) => {
  return (
    <CustomTooltip text={disabled ? disabledTooltip ?? "" : tooltip} className={className}>
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
