import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDashboardDropdownGetAll } from "@/endpoints/gubenComponents";

import { DeleteDropdownButton } from "./DeleteDropdownButton";
import { DropdownTabsList } from "../dropdownTab/DropdownTabsList";
import { DropdownLinkItem } from "./DropdownLinkItem";

export default function DropdownList() {
  const {
    data: dashboardDropdownResponse,
    isPending,
    refetch,
  } = useDashboardDropdownGetAll({});

  const dropdowns = dashboardDropdownResponse?.dashboardDropdowns ?? [];

  if (isPending) {
    return (
      <Card className="p-10 text-center text-sm text-muted-foreground shadow-none">
        Loading...
      </Card>
    );
  }

  return (
    <>
      {dropdowns.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground shadow-none">
          No dropdowns yet. Click{" "}
          <span className="font-bold">Add Dropdown</span> to create one.
        </Card>
      ) : (
        <div className="grid gap-4">
          {dropdowns.map((dd) => (
            <Card
              key={dd.id}
              className="p-4 flex flex-col gap-3 shadow-md max-w-[500px] w-full"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-medium truncate">{dd.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full border inline-flex items-center justify-center",
                      dd.link
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-gray-100 text-gray-700 border-gray-200",
                    )}
                  >
                    {dd.link ? "Link" : "Tabs"}
                  </div>

                  <DeleteDropdownButton dropdownId={dd.id} refetch={refetch} />
                </div>
              </div>

              {!dd.link && (
                <DropdownTabsList
                  dropdownId={dd.id}
                  tabs={dd.tabs}
                  refetch={refetch}
                />
              )}

              {dd.link && <DropdownLinkItem url={dd.link} />}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
