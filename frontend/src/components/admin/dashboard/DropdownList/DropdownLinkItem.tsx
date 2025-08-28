import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";

import { formatUrl } from "../formatUrl";

interface DropdownLinkItemProps {
  url: string;
}

export function DropdownLinkItem({ url }: DropdownLinkItemProps) {
  if (!url) return null;

  const handleCopy = () => navigator.clipboard.writeText(url);

  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <div className="text-sm text-muted-foreground flex items-center gap-2 min-w-0">
        <LinkIcon className="h-4 w-4 shrink-0" />
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="hover:underline truncate"
          title={url}
        >
          {formatUrl(url)}
        </a>
      </div>

      <div className="flex items-center gap-1">
        <a href={url} target="_blank" rel="noreferrer" title="Open">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
          title="Copy URL"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </Button>
      </div>
    </div>
  );
}
