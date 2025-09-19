import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { MapComponent } from "@/components/home/MapComponent";
import { InfoCard } from "@/components/home/InfoCard/InfoCard";
import { cn } from "@/lib/utils";
import {
  DashboardDropdownResponse,
  DashboardTabResponse,
  DropdownLinkResponse,
} from "@/endpoints/gubenSchemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardDropdownTabsProps {
  dropdowns: DashboardDropdownResponse[];
}

export const DashboardDropdownTabs = ({
  dropdowns,
}: DashboardDropdownTabsProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const allTabs = useMemo(() => {
    const tabs: DashboardTabResponse[] = [];
    dropdowns.forEach((d) => {
      if (d.tabs) {
        d.tabs.forEach((t) => {
          tabs.push(t);
        });
      }
    });
    return tabs;
  }, [dropdowns]);

  const tab = useMemo(
    () => allTabs.find((t) => t.id === activeTab) || null,
    [allTabs, activeTab],
  );

  useEffect(() => {
    if (!activeTab && allTabs.length > 0) {
      setActiveTab(allTabs[0].id);
    }
  }, [activeTab, allTabs]);

  return (
    <div>
      <div className="flex flex-row font-bold pl-2">
        {dropdowns.map(({ id, title, tabs, links, isLink }) => (
          <DashboardDropdownMenu
            key={id}
            title={title}
            activeTab={activeTab}
            tabs={tabs}
            links={links}
            isLink={isLink}
            onTabClick={(tabId) => setActiveTab(tabId)}
          />
        ))}
      </div>

      {activeTab && tab && (
        <div key={activeTab} className={"flex min-h-[70vh] h-full"}>
          <MapComponent src={tab.mapUrl} />
          <div className={"flex-1 h-full columns-2 px-4 pt-2"}>
            {tab?.informationCards?.map((card, index) => {
              return <InfoCard key={index} card={card} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface DashboardDropdownMenuProps {
  title: string;
  activeTab: string | null;
  isLink: boolean;
  tabs?: { id: string; title: string }[];
  links?: DropdownLinkResponse[];
  onTabClick?: (tabId: string) => void;
}

function DashboardDropdownMenu({
  title,
  tabs,
  links,
  isLink,
  activeTab,
  onTabClick,
}: DashboardDropdownMenuProps) {
  const [open, setOpen] = useState(false);

  const baseButtonClasses = cn(
    "rounded-md border border-gray-300 bg-gray-200 rounded-b-none",
    "px-3 py-2 text-sm font-semibold",
    "hover:bg-white hover:text-accent-foreground",
    "transition-colors",
  );

  const items = isLink
    ? (links ?? []).map((l) => ({
        key: l.id,
        label: l.title,
        onSelect: () => {
          window.open(l.link, "_blank");
          setOpen(false);
        },
        active: false,
      }))
    : (tabs ?? []).map((t) => ({
        key: t.id,
        label: t.title,
        onSelect: () => {
          onTabClick?.(t.id);
          setOpen(false);
        },
        active: t.id === activeTab,
      }));

  if (!items.length) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            baseButtonClasses,
            "data-[state=open]:bg-white data-[state=open]:shadow-sm",
          )}
        >
          {title}
          <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={6}
        collisionPadding={8}
        className="w-56 p-1 rounded-md border bg-popover text-popover-foreground shadow-md"
      >
        <ScrollArea className="max-h-72">
          <div className="py-1">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.key}
                onClick={item.onSelect}
                className={cn(
                  "cursor-pointer rounded-sm",
                  "focus:bg-accent focus:text-accent-foreground",
                  item.active && "font-semibold",
                )}
              >
                <span className="truncate">{item.label}</span>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
