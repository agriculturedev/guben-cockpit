import { ExternalLink } from "lucide-react";

import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";

interface PreviewButtonProps {
  url: string;
}

export const PreviewButton = ({ url }: PreviewButtonProps) => {
  return (
    <CustomTooltip text="Preview">
      <a href={url} target="_blank" rel="noreferrer" title="Open">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </a>
    </CustomTooltip>
  );
};
