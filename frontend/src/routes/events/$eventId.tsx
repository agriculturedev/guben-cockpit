import { useEventsGetById } from '@/endpoints/gubenComponents';
import { createFileRoute, NotFoundRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { eventId } = Route.useParams();
  const { data: event } = useEventsGetById({
    pathParams: { id: eventId }
  });

  if (!event?.result) return "Event not found";

  return (
    <main>
      {event.result.title}
    </main>
  )
}
