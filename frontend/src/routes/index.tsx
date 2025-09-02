import { InfoCard } from "@/components/home/InfoCard/InfoCard";
import { MapComponent } from "@/components/home/MapComponent";
import { View } from "@/components/layout/View";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardGetAll, useNextcloudGetImages } from "@/endpoints/gubenComponents";
import { Pages } from "@/routes/admin/_layout/pages";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from "@tanstack/zod-adapter";
import { useCallback } from "react";
import { z } from "zod";
import { Image, NextcloudImageCarousel } from "@/components/Images/NextcloudImageCarousel";
import { getParamsFromURI } from "@/lib/utils";

const SelectedTabSchema = z.object({
  selectedTabId: z.string().optional(),
})

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: zodValidator(SelectedTabSchema),
})

function HomeComponent() {
  const {selectedTabId} = Route.useSearch()
  const navigate = useNavigate({from: Route.fullPath})
  const {data: dashboardData} = useDashboardGetAll({});
  const {data: images} = useNextcloudGetImages({
    queryParams: { directory: selectedTabId },
  });

  const setSelectedTabId = useCallback(async (selectedTabId?: string | null) => {
    await navigate({search: (search: { selectedTabId: string | undefined }) => ({...search, selectedTabId: selectedTabId ?? undefined})})
  }, [navigate]);

  const orderedTabs = dashboardData?.tabs?.sort((a, b) => a.sequence - b.sequence);

  // default to first valid tab if the selectedTabId is undefined or does not exist in valid tab list
  if (
    (orderedTabs != null && orderedTabs.length >= 1)
    && (selectedTabId === undefined || !orderedTabs.map(t => t.id).includes(selectedTabId))
  ) {
    void setSelectedTabId(orderedTabs[0].id);
  }

  const groupedImages = images?.reduce((acc: Record<string, Image[]>, image) => {
    // Extract tabId from the filename path
    const params = getParamsFromURI( image.url );
    const directory = params.get("directory");

    if (!directory) return acc;

    if (!acc[directory]) acc[directory] = [];
    acc[directory].push({
      filename: image.filename,
      directory: directory
    });
    return acc;
  }, {});

  return (
    <View pageKey={Pages.Home}>
      <div>

        {orderedTabs != null && orderedTabs.length >= 1 &&
          <Tabs defaultValue={orderedTabs[0].id} className="w-full flex flex-col h-full" value={selectedTabId} onValueChange={setSelectedTabId}>
            <TabsList className={"flex flex-row font-bold pl-2"}>
              {orderedTabs.map((tab, index) => <TabsTrigger key={index} value={tab.id}>{tab.title}</TabsTrigger>)}
            </TabsList>

            {orderedTabs.map((tab, index) => <TabsContent key={index} value={tab.id} className={"h-full rounded bg-white p-1 flex-row gap-1 relative shadow border border-gray-300"}>
              <div className={"flex min-h-[70vh] h-full"}>
                <MapComponent src={tab.mapUrl}/>
                <div className="flex-1 h-full columns-2 px-4 pt-2 pb-2">
                  {tab?.informationCards?.map((card, index) => (
                    <InfoCard key={index} card={card} />
                  ))}

                  {groupedImages?.[tab.id] && groupedImages[tab.id].length > 0 && (
                    <NextcloudImageCarousel images={groupedImages[tab.id]} />
                  )}
                </div>
              </div>

            </TabsContent>)}

          </Tabs>
        }

      </div>
    </View>
  );
}
