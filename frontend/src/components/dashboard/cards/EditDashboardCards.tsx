import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { Card } from "@/components/ui/card";
import { InfoCard } from "@/components/home/InfoCard/InfoCardVariant1";
import * as React from "react";
import { DeleteDashboardCardButton } from "@/components/dashboard/cards/deleteDashboardCard/DeleteDashboardCardButton";
import { EditDashboardCardButton } from "@/components/dashboard/cards/editDashboardCard.tsx/editDashboardCardButton";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { CreateDashboardTabDialogButton } from "@/components/dashboard/createDashboardTab/CreateDashboardTabDialogButton";
import { CreateDashboardCardButton } from "@/components/dashboard/cards/createDashboardCard/CreateDashboardCardButton";

interface Props {
  tab: DashboardTabResponse;
  refetch: () => Promise<any>;
}

export const EditDashboardCards = ({tab, refetch}: Props) => {
  const {t} = useTranslation(["dashboard"]);
  const sortedCards = tab?.informationCards?.sort((a,b) => a.id.localeCompare(b.id));

  return (
    <Card className="flex flex-col gap-2 p-2 h-max">
      <div className={"flex gap-2 items-center"}>
        <Label className={"text-xl"}>{t("Cards.Cards")}</Label>
        <CreateDashboardCardButton onSuccess={refetch} dashboardTabId={tab.id}/>
      </div>

      <div className="flex flex-wrap h-max gap-2">
        {sortedCards?.map((card, index) => {
          return (
            <div className={"w-64 flex flex-col h-full"} key={index}>
              <InfoCard card={card}/>
              <div className={"w-full justify-evenly flex"}>
                <DeleteDashboardCardButton cardId={card.id} dashboardTabId={tab.id} refetch={refetch} />
                <EditDashboardCardButton card={card} dashboardTabId={tab.id} refetch={refetch} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  );
}
