import { EventImageResponse, EventResponse } from "@/endpoints/gubenSchemas";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getEventImage } from "@/lib/DefaultEventImage";
import DOMPurify from "dompurify";

type TEventCardContext = { event: EventResponse }
const EventCardContext = createContext<TEventCardContext | undefined>(undefined);

const useEventCard = () => {
  const context = useContext(EventCardContext);
  if (!context) throw new Error("Component must be used within an EventCard");
  return context;
}

function EventCard({event}: { event: EventResponse }) {
  return (
    <EventCardContext.Provider value={{event}}>
      <div className="flex justify-between gap-8 p-8 w-full rounded-2xl h-80 space-y-4 shadow-md bg-white">
        <div className="flex-1 content-center">
          {event.images.length > 0 ? (
            <EventCard.ImageBox/>
          ) : (
            <EventCard.DefaultCategoryImage/>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <EventCard.CategoryTags/>
          <EventCard.Title/>
          <EventCard.Description/>
          <EventCard.MoreInfoButton/>
        </div>

        <div className="flex-1 space-y-2">
          <EventCard.Location/>
          <EventCard.Dates/>
        </div>
      </div>
    </EventCardContext.Provider>
  )
}

EventCard.Title = () => {
  const {event} = useEventCard();
  return (
    <h2>{event.title}</h2>
  )
}

EventCard.Description = () => {
  const {event} = useEventCard();
  if ((event as any).isBookingEvent) {
    return (
      <div
        className="text-muted-foreground line-clamp-2"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
      />
    );
  }

  return (
    <p className="text-muted-foreground line-clamp-2">{event.description}</p>
  );
}

interface EventCardImageProps {
  images: EventImageResponse[];
}

EventCard.ImageBox = () => {
  const {event} = useEventCard();
  const [selectedImage, setSelectedImage] = useState(0);

  const adjustIndex = useCallback((toAdd: number) => setSelectedImage(
    curr => Math.max(event.images.length - 1, Math.min(0, curr + toAdd))
  ), []);

  return event.images[selectedImage] && (
    <div className="text-white relative max-h-full rounded-lg overflow-hidden group">
      {(selectedImage > 0 && event.images.length > 1) && (
        <span
          onClick={() => adjustIndex(-1)}
          className="absolute left-0 top-0 opacity-0 flex items-center h-full px-1 animate-in duration-150 bg-black bg-opacity-25 hover:cursor-pointer group-hover:opacity-100 transition-opacity"
        >
          <CaretLeftIcon className="size-10"/>
        </span>
      )}

      <img
        className="h-full object-center object-cover m-auto rounded-lg"
        src={event.images[selectedImage].previewUrl}
      />
      {(event.images.length > 1 && selectedImage < event.images.length - 1) && (
        <span
          onClick={() => adjustIndex(1)}
          className="absolute right-0 top-0 opacity-0 flex items-center h-full px-1 animate-in duration-150 bg-black bg-opacity-25 hover:cursor-pointer group-hover:opacity-100 transition-opacity"
        >
          <CaretRightIcon className="size-10"/>
        </span>
      )}
    </div>
  )
}

EventCard.DefaultCategoryImage = () => {
  const {event} = useEventCard();

  var image = getEventImage(event.categories[0].name)

  return image != null ? (
    <div className="rounded-lg h-full flex items-center justify-center overflow-hidden">
      <img
        className="max-h-full max-w-full object-contain"
        src={image}
      />
    </div>
  ) : null;
}

EventCard.CategoryTags = () => {
  const {event} = useEventCard();

  return (
    <div className="flex flex-wrap gap-2">
      {event.categories.map(c => (
        <span key={c.id} className="border text-sm text-muted-foreground rounded-full py-1 px-2">{c.name}</span>
      ))}
    </div>
  )
}

EventCard.Dates = () => {
  const {event} = useEventCard();

  const [startDate, endDate] = useMemo(() => [
    new Date(event.startDate),
    new Date(event.endDate)
  ], [event]);

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <ClockIcon className={"size-4"}/>
      <p className="">{startDate.formatDateTime()} - {endDate.formatDateTime()}</p>
    </div>
  )
}

EventCard.Location = () => {
  const {event} = useEventCard();

  return (
    <div className="flex gap-2 items-center text-muted-foreground">
      <MapPinIcon className="size-4"/>
      <p className="">{event.location.street}, {event.location.zip} {event.location.city}</p>
    </div>
  )
}

EventCard.MoreInfoButton = () => {
  const {event} = useEventCard();
  const {t} = useTranslation("common");

  const linkProps = (event as any).isBookingEvent
    ? { to: "/events/" + event.id, state: { event } }
    : { to: "/events/" + event.id };

  return (
    <Link {...linkProps} className={"flex flex-nowrap gap-2 items-center border w-min rounded-md px-2 py-1 text-muted-foreground hover:text-red-500 hover:bg-red-50"}>
      <p className="text-nowrap">{t("MoreInformation")}</p>
      <ArrowRightIcon className="size-4"/>
    </Link>
  )
}

export default EventCard;
