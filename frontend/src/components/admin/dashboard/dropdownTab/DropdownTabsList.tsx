import { useTranslation } from "react-i18next";
import { LinkIcon } from "lucide-react";

import { DashboardTabResponse } from "@/endpoints/gubenSchemas";

import { formatUrl } from "../formatUrl";
import { ShowCardsButton } from "../dropdownTabCard/ShowCardsButton";
import { PreviewButton } from "../PreviewButton";
import { CreateTabButton } from "./CreateTabButton";
import { DeleteTabButton } from "./DeleteTabButton";
import { CopyButton } from "../CopyButton";
import { EditTabButton } from "./EditTabButton";

interface DropdownTabsListProps {
  dropdownId: string;
  refetch: () => Promise<any>;
  tabs?: DashboardTabResponse[];
}

export function DropdownTabsList({
  dropdownId,
  tabs,
  refetch,
}: DropdownTabsListProps) {
  const { t } = useTranslation(["dashboard", "common"]);

  const createTabButtonElement = (
    <CreateTabButton dropdownId={dropdownId} onSuccess={refetch} />
  );

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
    <div>
      <ul className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className="relative flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <div className="flex-1 min-w-0">
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
                    canEdit={tab.canEdit}
                    refetch={refetch}
                  />
                  {tab.canEdit && <EditTabButton tab={tab} refetch={refetch} />}
                  <DeleteTabButton tabId={tab.id} refetch={refetch} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {createTabButtonElement}
    </div>
  );
}
