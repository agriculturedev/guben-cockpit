import {Copy, ExternalLink, LinkIcon} from "lucide-react";

import { Button } from "@/components/ui/button";

import { CreateTabButton } from "../CreateTabButton";
import { formatUrl } from "../formatUrl";

export type TabItem = {
  id: string;
  title: string;
  link?: string;
};

interface DropdownTabsListProps {
  dropdownId: string;
  tabs?: TabItem[];
}

export function DropdownTabsList({ dropdownId, tabs }: DropdownTabsListProps) {
  const createTabButtonElement = (
    <CreateTabButton dropdownId={dropdownId} />
  )

  if (!tabs || tabs.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <div className="italic text-sm text-muted-foreground">No tabs yet</div>
        { createTabButtonElement }
      </div>
    );
  }

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className="flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{tab.title}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <LinkIcon className="h-3.5 w-3.5" />
                {tab.link ? (
                  <>
                    <a
                      href={tab.link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline truncate"
                      title={tab.link}
                    >
                      {formatUrl(tab.link)}
                    </a>
                    <a
                      href={tab.link}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1 inline-flex"
                      title="Open"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <CopyButton text={tab.link} />
                  </>
                ) : (
                  <span className="italic">No URL</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      { createTabButtonElement }
    </div>
  );
}

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
  return (
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
  );
}
