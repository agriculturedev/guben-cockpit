import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { View } from "@/components/layout/View";
import { useDashboardDropdownGetAll } from "@/endpoints/gubenComponents";
import { Pages } from "@/routes/admin/_layout/pages";
import { DashboardDropdownTabs } from "@/components/home/DashboardDropdownNav";

const SelectedTabSchema = z.object({
  selectedTabId: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: zodValidator(SelectedTabSchema),
});

function HomeComponent() {
  const { data: dropdowns } = useDashboardDropdownGetAll({});

  return (
    <View pageKey={Pages.Home}>
      <DashboardDropdownTabs dropdowns={dropdowns?.dashboardDropdowns ?? []} />
    </View>
  );
}
