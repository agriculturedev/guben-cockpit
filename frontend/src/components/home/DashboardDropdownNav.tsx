import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { MapComponent } from "@/components/home/MapComponent";
import { InfoCard } from "@/components/home/InfoCard/InfoCard";
import { cn } from "@/lib/utils";
import {
  DashboardDropdownResponse,
  DashboardTabResponse,
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
        {dropdowns.map(({ id, title, link, tabs }) => (
          <DashboardDropdownMenu
            key={id}
            title={title}
            link={link}
            activeTab={activeTab}
            tabs={tabs}
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
  link?: string | null;
  tabs?: { id: string; title: string }[];
  onTabClick?: (tabId: string) => void;
}

function DashboardDropdownMenu({
  title,
  tabs,
  link,
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

  if (link) {
    return (
      <Button
        variant="ghost"
        className={baseButtonClasses}
        onClick={() => window.open(link, "_blank")}
      >
        {title}
      </Button>
    );
  }

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
        {tabs && tabs.length > 0 ? (
          <ScrollArea className="max-h-72">
            <div className="py-1">
              {tabs.map((t, i) => {
                const active = t.id === activeTab;
                return (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => {
                      onTabClick?.(t.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer rounded-sm",
                      "focus:bg-accent focus:text-accent-foreground",
                      active && "font-semibold",
                    )}
                  >
                    <span className="truncate">{t.title}</span>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground">No tabs</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
