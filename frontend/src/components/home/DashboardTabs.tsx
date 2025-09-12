import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapComponent } from "@/components/home/MapComponent";
import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { InfoCard } from "@/components/home/InfoCard/InfoCard";
import {
  useDashboardGetAll,
  useNextcloudGetImages,
} from "@/endpoints/gubenComponents";

import {
  NextcloudImageCarousel,
  type Image,
} from "../Images/NextcloudImageCarousel";
import { getParamsFromURI } from "@/lib/utils";

export const DashboardTabs = () => {
  const { data: dashboardData } = useDashboardGetAll({});
  const [selectedTab, setSelectedTab] = useState<string>();
  const { data: images } = useNextcloudGetImages({
    queryParams: { directory: selectedTab },
  });

  const onTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const orderedTabs =
    dashboardData?.tabs?.sort((a, b) => a.sequence - b.sequence) ?? [];

  const groupedImages = images?.reduce(
    (acc: Record<string, Image[]>, image) => {
      // Extract tabId from the filename path
      const params = getParamsFromURI(image.url);
      const directory = params.get("directory");

      if (!directory) return acc;

      if (!acc[directory]) acc[directory] = [];
      acc[directory].push({
        filename: image.filename,
        directory: directory,
      });
      return acc;
    },
    {},
  );

  useEffect(() => {
    if (!selectedTab && orderedTabs.length > 0) {
      setSelectedTab(orderedTabs[0].title);
    }
  }, [orderedTabs]);

  return (
    <Tabs
      defaultValue="account"
      className="w-full flex flex-col h-full"
      value={selectedTab}
      onValueChange={onTabChange}
    >
      <TabsList className={"flex flex-row font-bold pl-2"}>
        {orderedTabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.title}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {orderedTabs.map((tab, index) => (
        <TabsContent
          key={index}
          value={tab.title}
          className={
            "h-full rounded bg-white p-1 flex-row gap-1 relative shadow border border-gray-300"
          }
        >
          <div className={"flex min-h-[70vh] h-full"}>
            <MapComponent src={tab.mapUrl} />
            <div className={"flex-1 h-full columns-2 px-4 pt-2"}>
              {tab?.informationCards?.map((card, index) => {
                return <InfoCard key={index} card={card} />;
              })}
              {groupedImages?.[tab.id] && groupedImages[tab.id].length > 0 && (
                <NextcloudImageCarousel images={groupedImages[tab.id]} />
              )}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
