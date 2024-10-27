import { EventListResponseDataItem } from "@/endpoints/gubenProdSchemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventDate } from "@/components/events/EventDate";

interface EventCardProps {
  event: EventListResponseDataItem;
}

export const EventCard = ({event}: EventCardProps) => {
  const startDate = event.attributes?.startDate ? new Date(event.attributes?.startDate) : null
  const endDate = event.attributes?.endDate ? new Date(event.attributes?.endDate) : null
  const categories = event.attributes?.categories?.data ?? []
  const hasCategories = categories?.length > 0;

  const links = event.attributes?.urls ?? [];
  const filteredLinks = links.filter((link: any) => link.link !== '' && link.description !== '')

  const locationCity = event.attributes?.locationCity;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={"text-gubenAccent"}>{event.attributes?.title}</CardTitle>
          <CardDescription>
            <ScrollArea className="h-24 rounded">
              {event.attributes?.description}
            </ScrollArea>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventDate startDate={startDate} endDate={endDate}/>

          {hasCategories &&
	          <div className={"grid grid-cols-3 gap-2"}>
		          <div className={"col-span-1 flex justify-end"}>Kategorie</div>
		          <div className={"col-span-2"}>{categories?.map(c => c.attributes?.Name).join(", ")}</div>
	          </div>
          }

          {locationCity &&
		        <div className={"grid grid-cols-3 gap-2"}>
			        <div className={"col-span-1 flex justify-end"}>Ort</div>
			        <div
				        className={"col-span-2"}>{locationCity}
			        </div>
		        </div>
          }

          {filteredLinks.length > 0 &&
		        <div className={"grid grid-cols-3 gap-2"}>
			        <div className={"col-span-1 flex justify-end"}>Links</div>
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
