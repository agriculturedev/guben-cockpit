import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { View } from "@/components/layout/View";
import { DashboardTabs } from "@/components/home/DashboardTabs";
import { useDashboardGetAll } from "@/endpoints/gubenComponents";
import { Pages } from "@/routes/admin/_layout/pages";

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const {data: dashboardData} = useDashboardGetAll({});

  return (
    <View pageKey={Pages.Home}>
      {dashboardData?.tabs && <DashboardTabs tabs={dashboardData.tabs}/>}
    </View>
  );
}
