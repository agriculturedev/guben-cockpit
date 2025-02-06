import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventDate } from "@/components/events/EventDate";
import {EventResponse} from "@/endpoints/gubenSchemas";
import { useTranslation } from "react-i18next";

interface EventCardProps {
  event: EventResponse;
}

export const EventCard = ({event}: EventCardProps) => {
  const {t} = useTranslation();

  const startDate = event.startDate ? new Date(event.startDate) : null
  const endDate = event.endDate ? new Date(event.endDate) : null
  const categories = event.categories ?? []
  const hasCategories = categories?.length > 0;

  const links = event.urls ?? [];
  const filteredLinks = links.filter((link: any) => link.link !== '' && link.description !== '')

  const locationCity = event.location.city;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={"text-gubenAccent"}>{event.title}</CardTitle>
          <CardDescription>
            <ScrollArea className="h-24 rounded">
              {event.description}
            </ScrollArea>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventDate startDate={startDate} endDate={endDate}/>

          {hasCategories &&
	          <div className={"grid grid-cols-3 gap-2"}>
		          <div className={"col-span-1 flex justify-end"}>{t("Category")}</div>
		          <div className={"col-span-2"}>{categories?.map(c => c.name).join(", ")}</div>
	          </div>
          }

          {locationCity &&
		        <div className={"grid grid-cols-3 gap-2"}>
			        <div className={"col-span-1 flex justify-end"}>{t("Location")}</div>
			        <div
				        className={"col-span-2"}>{locationCity}
			        </div>
		        </div>
          }

          {filteredLinks.length > 0 &&
		        <div className={"grid grid-cols-3 gap-2"}>
			        <div className={"col-span-1 flex justify-end"}>{t("Links")}</div>
			        <div
				        className={"col-span-2"}>{
                filteredLinks.map((link: any, index: number) =>
                  <a className={"text-blue-700 underline"} href={link.link}>
                    {index !== 0 && ", "}{link.description}
                  </a>
                )
              }
			        </div>
            </div>
          }

        </CardContent>
      </Card>
    </>
  )
}
