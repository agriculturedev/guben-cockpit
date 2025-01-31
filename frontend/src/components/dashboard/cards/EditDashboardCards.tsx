import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { Card } from "@/components/ui/card";
import { InfoCard } from "@/components/home/InfoCard/InfoCardVariant1";
import * as React from "react";
import { DeleteDashboardCardButton } from "@/components/dashboard/cards/deleteDashboardCard/DeleteDashboardCardButton";
import { EditDashboardCardButton } from "@/components/dashboard/cards/editDashboardCard.tsx/editDashboardCardButton";

interface Props {
  tab: DashboardTabResponse;
  refetch: () => Promise<any>;
}

export const EditDashboardCards = ({tab, refetch}: Props) => {
  const sortedCards = tab?.informationCards?.sort((a,b) => a.id.localeCompare(b.id));

  return (
    <Card className="flex flex-wrap gap-2 h-max">
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
    </Card>
  );
}
