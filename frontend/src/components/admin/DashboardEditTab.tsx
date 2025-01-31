import { useDashboardGetAll } from "@/endpoints/gubenComponents";
import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "../ui/comboBox";
import { Label } from "@/components/ui/label";
import { EditDashboardTab } from "../dashboard/editDashboardTab/EditDashboardTab";
import { CreateDashboardTabDialogButton } from "@/components/dashboard/createDashboardTab/CreateDashboardTabDialogButton";
import { DeleteDashboardTabButton } from "@/components/dashboard/deleteDashboardTab/DeleteDashboardTabButton";
import { EditDashboardCards } from "@/components/dashboard/cards/EditDashboardCards";


export const DashboardPage = () => {
  const {data: dashboardData, isLoading, refetch: refetchDashboard} = useDashboardGetAll({});
  const [selectedTabId, setselectedTabId] = useState<string | undefined>();
  const {t} = useTranslation(["dashboard", "common"]);

  const refetchAndUnselectTab = useCallback(async () => {
    await refetchDashboard();
    setselectedTabId(undefined);
  }, [refetchDashboard, setselectedTabId]);

  const selectedTab = dashboardData?.tabs?.find((tab: DashboardTabResponse) => tab.id === selectedTabId);
  const orderedTabs = dashboardData?.tabs?.sort((a, b) => a.sequence - b.sequence);

  const options = useMemo(() => orderedTabs?.map((tab: DashboardTabResponse) => {
    return {label: tab.title, value: tab.id}
  }) ?? [], [dashboardData?.tabs]);

  return (
    <div className="flex flex-col gap-2">
      <div className={"flex gap-2 items-center"}>
        <Label>
          {t("SelectTabToEdit")}
        </Label>
        <Combobox options={options} placeholder={t("Search", {ns: "common"})} isLoading={isLoading} onSelect={setselectedTabId} value={selectedTabId} defaultOpen={false}/>
        <CreateDashboardTabDialogButton onSuccess={refetchAndUnselectTab}/>
        {selectedTab && <DeleteDashboardTabButton dashboardTabId={selectedTab.id} refetch={refetchAndUnselectTab}/>}
      </div>

      {selectedTab &&
        <div className="flex flex-wrap gap-4">

          <div>
            <Label className={"text-xl"}>{t("TabInformation")}</Label>
            <EditDashboardTab tab={selectedTab} onSuccess={refetchDashboard}/>
          </div>

          <div>
            <Label className={"text-xl"}>{t("Cards.Cards")}</Label>
            <EditDashboardCards tab={selectedTab} refetch={refetchDashboard}/>
          </div>

        </div>
      }
    </div>
  )
}


