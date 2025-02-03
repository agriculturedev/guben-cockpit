import { PencilIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/general/Tooltip";
import { cn } from "@/lib/utils";

interface EditIconButtonProps {
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

export const EditIconButton = ({ tooltip, disabledTooltip, onClick, dialogTrigger = false, disabled = false }: EditIconButtonProps) => {
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
