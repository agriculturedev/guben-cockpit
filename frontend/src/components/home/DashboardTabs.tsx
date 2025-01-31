import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ReactNode} from "@tanstack/react-router";
import {MapComponent} from "@/components/home/MapComponent";
import {useState} from "react";
import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { InfoCard } from "@/components/home/InfoCard/InfoCardVariant1";
import * as React from "react";

interface DashboardTabsProps {
    tabs: DashboardTabResponse[];
}

export const DashboardTabs = ({tabs}: DashboardTabsProps) => {
    const [selectedTab, setSelectedTab] = useState(tabs[0]?.title ?? "");

    const onTabChange = (value: string) => {
        setSelectedTab(value);
    }

    const orderedTabs = tabs.sort((a, b) => a.sequence - b.sequence);

    return (
        <Tabs defaultValue="account" className="w-full flex flex-col h-full" value={selectedTab} onValueChange={onTabChange}>
            <TabsList className={"flex flex-row font-bold pl-2"}>
                {orderedTabs.map((tab, index) => <TabsTrigger key={index} value={tab.title}>{tab.title}</TabsTrigger>)}
            </TabsList>

            {orderedTabs.map((tab, index) => <TabsContent key={index} value={tab.title} className={"h-full rounded bg-white p-1 flex-row gap-1 relative shadow border border-gray-300"}>
                <div className={"flex min-h-[70vh] h-full"}>
                  <MapComponent src={tab.mapUrl} />
                  <div className={"flex-1 h-full columns-2 px-4 pt-2"}>
                      {tab?.informationCards?.map((card, index) => {
                        return (
                          <InfoCard key={index} card={card}/>
                        )
                      })}
                    </div>
                </div>

            </TabsContent>)}

        </Tabs>
    )
}
