import { CreateDashboardCardButton } from "@/components/dashboard/cards/createDashboardCard/CreateDashboardCardButton";
import { DeleteDashboardCardButton } from "@/components/dashboard/cards/deleteDashboardCard/DeleteDashboardCardButton";
import { EditDashboardCardButton } from "@/components/dashboard/cards/editDashboardCard.tsx/editDashboardCardButton";
import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { useTranslation } from "react-i18next";
import { InfoCard } from "@/components/home/InfoCard/InfoCard";
import { FloatingCardButtons } from "@/components/ui/floatingCardButtons";

interface Props {
  tab: DashboardTabResponse;
  refetch: () => Promise<any>;
}

export const EditDashboardCards = ({tab, refetch}: Props) => {
  const {t} = useTranslation(["dashboard"]);
  const sortedCards = tab?.informationCards?.sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className='gap-4'>
      <div className="flex gap-2 mb-2">
        <h1>{t("Cards.Cards")}</h1>
        <CreateDashboardCardButton onSuccess={refetch} dashboardTabId={tab.id}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pr-4">
        {sortedCards?.map((card, index) => (
          <FloatingCardButtons key={index}>

            <InfoCard card={card}/>

            <FloatingCardButtons.Buttons>
              <EditDashboardCardButton card={card} dashboardTabId={tab.id} refetch={refetch}/>
              <DeleteDashboardCardButton cardId={card.id} dashboardTabId={tab.id} refetch={refetch}/>
            </FloatingCardButtons.Buttons>

          </FloatingCardButtons>
        ))}
      </div>
    </div>
  );
}

