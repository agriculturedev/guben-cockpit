import { CreateDashboardCardButton } from "@/components/dashboard/cards/createDashboardCard/CreateDashboardCardButton";
import { DeleteDashboardCardButton } from "@/components/dashboard/cards/deleteDashboardCard/DeleteDashboardCardButton";
import { EditDashboardCardButton } from "@/components/dashboard/cards/editDashboardCard.tsx/editDashboardCardButton";
import { Card } from "@/components/ui/card";
import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Props {
  tab: DashboardTabResponse;
  refetch: () => Promise<any>;
}

export const EditDashboardCards = ({ tab, refetch }: Props) => {
  const { t } = useTranslation(["dashboard"]);
  const sortedCards = tab?.informationCards?.sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className='gap-4'>
      <div className="flex gap-2 mb-2">
        <h1>{t("Cards.Cards")}</h1>
        <CreateDashboardCardButton onSuccess={refetch} dashboardTabId={tab.id} />
      </div>

      <div className="grid grid-cols-4 gap-5 p-4">
        {sortedCards?.map((card, index) => (
          <Card key={index} className=" p-8 flex flex-col gap-2 relative">
            {card.imageUrl &&
              <img
                className="rounded-lg"
                src={card.imageUrl}
                alt={card.imageAlt ?? undefined}
              />
            }

            <h2 className="font-bold">{card.title}</h2>
            <Markdown className={"text-gray-500"} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} >
              {card.description}
            </Markdown>

            {card.button &&
              <a
                className="bg-gubenAccent mt-auto hover:bg-red-400 rounded-lg py-2 px-4 text-white w-1/2"
                href={card.button?.url}
                target={card.button.openInNewTab ? "_blank" : "_self"}
              >{card.button?.title}</a>
            }

            <div className="flex flex-col gap-2 absolute right-0 top-4 translate-x-[45%]">
              <EditDashboardCardButton card={card} dashboardTabId={tab.id} refetch={refetch} />
              <DeleteDashboardCardButton cardId={card.id} dashboardTabId={tab.id} refetch={refetch} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
