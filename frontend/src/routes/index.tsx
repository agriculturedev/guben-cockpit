import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useGetHomeView } from "@/endpoints/gubenProdComponents";
import { View } from "@/components/layout/View";
import { DashboardTabs, TabItem } from "@/components/home/DashboardTabs";
import { InfoCardVariant1 } from "@/components/home/InfoCard/InfoCardVariant1";

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const {data: homeViewData} = useGetHomeView({queryParams: {populate: "tabs,tabs.cards,tabs.cards.button"}});

  const tabItems: TabItem[] | undefined = homeViewData?.data?.attributes?.tabs?.data?.map((tab) => {
    return {
      value: tab?.attributes?.title,
      description: tab?.attributes?.title,
      content: tab?.attributes?.cards?.map((card) => {
        return (
          <InfoCardVariant1 key={card.id} card={card}/>
        )
      })
    } as TabItem
  });

  return (
    <View pageKey={"Home"}>
      {tabItems && <DashboardTabs tabs={tabItems}/>}
    </View>
  );
}
