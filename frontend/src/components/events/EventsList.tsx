import {EventCard} from "@/components/events/EventCard";
import { EventResponse } from "@/endpoints/gubenSchemas";


interface EventsListProps {
    events?: EventResponse[];
}

export const EventsList = ({events}: EventsListProps) => {
    return (
        <div className={"grid grid-cols-3 gap-2"}>
          {events &&
            events.map((event, index) =>
              <EventCard key={index} event={event} />)
          }
        </div>
    )
}
