import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { View } from "@/components/layout/View";
import { DashboardTabs, TabItem } from "@/components/home/DashboardTabs";
import { InfoCard } from "@/components/home/InfoCard/InfoCardVariant1";
import { useDashboardGetAll } from "@/endpoints/gubenComponents";

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const {data: dashboardData} = useDashboardGetAll({});

  const tabItems: TabItem[] | undefined = dashboardData?.tabs?.map((tab) => {
    return {
      title: tab?.title,
      content: tab?.informationCards?.map((card, index) => {
        return (
          <InfoCard key={index} card={card}/>
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
