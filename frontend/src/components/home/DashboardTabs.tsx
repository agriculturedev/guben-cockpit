import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ReactNode} from "@tanstack/react-router";
import {MapComponent} from "@/components/home/MapComponent";
import {useState} from "react";

export interface TabItem {
    title: string;
    content: ReactNode;
}


interface DashboardTabsProps {
    tabs: TabItem[];
}

export const DashboardTabs = ({tabs}: DashboardTabsProps) => {
    const [tab, setTab] = useState(tabs[0]?.title ?? "");

    const onTabChange = (value: string) => {
        setTab(value);
    }

    return (
        <Tabs defaultValue="account" className="w-full flex flex-col h-full" value={tab} onValueChange={onTabChange}>
            <TabsList className={"flex flex-row font-bold pl-2"}>
                {tabs.map((tab, index) => <TabsTrigger key={index} value={tab.title}>{tab.title}</TabsTrigger>)}
            </TabsList>

            {tabs.map((tabContent, index) => <TabsContent key={index} value={tabContent.title} className={"h-full rounded bg-white p-1 flex-row gap-1 relative shadow border border-gray-300"}>
                <div className={"flex min-h-[70vh] h-full"}>
                    {index === 0 &&  <MapComponent src={"https://guben.elie.de/?Map/layerIds=02886f50-7bd5-46d3-a763-974213df3431,111222356,111222357,111222358,111222359,111222360,111222364,111222348&visibility=true,true,true,true,true,true,true,true&transparency=0,0,0,0,0,0,0,0"} />}
                    {index === 1 &&  <MapComponent src={"https://guben.elie.de/?Map/layerIds=02886f50-7bd5-46d3-a763-974213df3431,111222349,111222366,111222365,111222368&visibility=true,true,true,true,true&transparency=0,0,0,0,0"} />}
                    {index === 2 &&  <MapComponent src={"https://guben.elie.de/?Map/layerIds=02886f50-7bd5-46d3-a763-974213df3431,111222367,111222362,111222363,111222361&visibility=true,true,true,true,true&transparency=0,0,0,0,0"} />}
                    {index === 3 &&  <MapComponent src={"https://guben.elie.de/?Map/layerIds=02886f50-7bd5-46d3-a763-974213df3431,111222355,111222350,111222341&visibility=true,true,true,true&transparency=0,0,0,0"} />}
                    {index === 4 &&  <MapComponent src={"https://guben.elie.de/?Map/layerIds=02886f50-7bd5-46d3-a763-974213df3431,211222351,111222351,111222352,111222354,111222354&visibility=true,true,true,true,true,true&transparency=0,0,0,0,0,0"} />}
                    <div className={"flex-1 h-full columns-2 px-4 pt-2"}>
                        {tabContent.content}
                    </div>
                </div>

            </TabsContent>)}

        </Tabs>
    )
}
