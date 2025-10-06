import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GripVertical, LinkIcon } from "lucide-react";

import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { formatUrl } from "../formatUrl";
import { ShowCardsButton } from "../dropdownTabCard/ShowCardsButton";
import { PreviewButton } from "../PreviewButton";
import { CreateTabButton } from "./CreateTabButton";
import { DeleteTabButton } from "./DeleteTabButton";
import { CopyButton } from "../CopyButton";
import { EditTabButton } from "./EditTabButton";
import { SortableList } from "@/components/dnd/SortableList";
import { Button } from "@/components/ui/button";
import { useDashboardDropdownReorder } from "@/endpoints/gubenComponents";

interface DropdownTabsListProps {
  dropdownId: string;
  refetch: () => Promise<any>;
  tabs?: DashboardTabResponse[];
  isAdmin?: boolean;
}

export function DropdownTabsList({
  dropdownId,
  tabs,
  refetch,
  isAdmin,
}: DropdownTabsListProps) {
  const { t } = useTranslation(["dashboard", "common"]);
  const [orderedTabs, setOrderedTabs] = useState<DashboardTabResponse[]>(tabs ?? []);

  useEffect(() => {
    setOrderedTabs(tabs ?? []);
  }, [tabs]);

  const isDirty = useMemo(() => {
    if (!tabs) return false;
    if (orderedTabs.length !== tabs.length) return true;
    for (let i = 0; i < orderedTabs.length; i++) {
      if (orderedTabs[i].id !== tabs[i].id) return true;
    }
    return false;
  }, [orderedTabs, tabs]);

  const createTabButtonElement = isAdmin && (
    <CreateTabButton dropdownId={dropdownId} onSuccess={refetch} />
  );

  const reorderTabs = useDashboardDropdownReorder({
    onSuccess: async () => {
      await refetch();
    },
  });

  const handleSaveOrder = () => {
    if (!isDirty || orderedTabs.length === 0) return;
    const orderedTabIds = orderedTabs.map((tab) => tab.id);
    reorderTabs.mutate({
      pathParams: { id: dropdownId },
      body: { orderedTabIds },
    });
  };

  if (!tabs || tabs.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <div className="italic text-sm text-muted-foreground">
          {t("NoTabsYet")}
        </div>
        {createTabButtonElement}
      </div>
    );
  }

  return (
    <div className="max-h-[80vh]">
      <ul className="flex flex-col gap-2">
        <SortableList
          items={orderedTabs}
          getId={(tab) => tab.id}
          axis="y"
          renderItem={(tab, handle) => (
            <li
              key={tab.id}
              className="relative flex items-center gap-2 rounded-lg border px-3 py-2 mb-2"
            >
              {isAdmin && (
                <button
                  type="button"
                  {...handle.attributes}
                  {...handle.listeners}
                  className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent absolute left-2 top-1/2 -translate-y-1/2 z-10"
                  aria-label={t("DragToReorder")}
                  title={t("DragToReorder")}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
              )}
              <div className="flex-1 min-w-0 pl-6">
                <div className="text-sm font-medium truncate mb-1">
                  {tab.title}
                </div>
                <div className="text-xs text-muted-foreground flex items-center truncate">
                  <LinkIcon className="h-3.5 w-3.5" />
                  {tab.mapUrl ? (
                    <>
                      <div className="truncate mr-2 ml-1">
                        {formatUrl(tab.mapUrl)}
                      </div>
                      <PreviewButton url={tab.mapUrl} />
                      <CopyButton text={tab.mapUrl} />
                    </>
                  ) : (
                    <div className="truncate mr-2 ml-1 italic">{t("NoUrl")}</div>
                  )}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <ShowCardsButton
                      tabId={tab.id}
                      informationCards={tab.informationCards ?? []}
                      canEdit={isAdmin || tab.canEdit}
                      refetch={refetch}
                    />
                    {isAdmin &&
                      <EditTabButton tab={tab} refetch={refetch} />}
                    {isAdmin && (
                      <DeleteTabButton tabId={tab.id} refetch={refetch} />
                    )}
                  </div>
                </div>
              </div>
            </li>
          )}
          onReorder={(ids: string[]) => {
            const byId = new Map(orderedTabs.map((tab) => [tab.id, tab]));
            const next = ids.map((id) => byId.get(id)).filter(Boolean) as DashboardTabResponse[];
            if (next.length === ids.length) setOrderedTabs(next);
          }}
        />
      </ul>
      {createTabButtonElement}
      {isAdmin && (
        <div className="flex justify-end mt-2">
          <Button
            type="button"
            variant="default"
            disabled={!isDirty || reorderTabs.isPending}
            onClick={handleSaveOrder}
          >
            {t("common:Save")}
          </Button>
        </div>
      )}
    </div>
  );
}