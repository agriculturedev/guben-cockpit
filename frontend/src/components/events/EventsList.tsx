import {EventListResponseDataItem} from "@/endpoints/gubenProdSchemas";
import {EventCard} from "@/components/events/EventCard";


interface EventsListProps {
    events?: EventListResponseDataItem[];
}

export const EventsList = ({events}: EventsListProps) => {
    return (
        <div className={"grid grid-cols-3 gap-2"}>{events && events.map((event, index) => <EventCard key={index} event={event} />)}</div>
    )
}
