import { Copy } from "lucide-react";

import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  return (
    <CustomTooltip text="Copy URL">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => navigator.clipboard.writeText(text)}
        title="Copy URL"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </CustomTooltip>
  );
};
