import { useDashboardGetAll } from "@/endpoints/gubenComponents";
import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "../ui/comboBox";
import { Label } from "@/components/ui/label";
import { EditDashboardTab } from "../dashboard/editDashboardTab/EditDashboardTab";
import { CreateDashboardTabDialogButton } from "@/components/dashboard/createDashboardTab/CreateDashboardTabDialogButton";


export const DashboardPage = () => {
  const {data: dashboardData, isLoading, refetch} = useDashboardGetAll({});
  const [selectedTabId, setselectedTabId] = useState<string | undefined>();
  const {t} = useTranslation(["dashboard", "common"]);

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
        <CreateDashboardTabDialogButton onSuccess={refetch}/>
      </div>

      {selectedTab && <EditDashboardTab tab={selectedTab} onSuccess={refetch}/>}
    </div>
  )
}


