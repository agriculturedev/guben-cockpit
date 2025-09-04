import { LinkIcon } from "lucide-react";

import { formatUrl } from "../formatUrl";
import { CopyButton } from "../CopyButton";
import { PreviewButton } from "../PreviewButton";

interface DropdownLinkItemProps {
  url: string;
}

export function DropdownLinkItem({ url }: DropdownLinkItemProps) {
  if (!url) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <div className="text-sm text-muted-foreground flex items-center gap-2 min-w-0">
        <LinkIcon className="h-4 w-4 shrink-0" />
        <div className="truncate" title={url}>
          {formatUrl(url)}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <PreviewButton url={url} />
        <CopyButton text={url} />
      </div>
    </div>
  );
}
