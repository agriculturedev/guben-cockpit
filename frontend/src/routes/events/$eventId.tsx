import { useEventsGetById } from '@/endpoints/gubenComponents';
import { createFileRoute } from '@tanstack/react-router';
import { ClockIcon, MapPinIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/events/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation("common");

  const { eventId } = Route.useParams();
  const { data } = useEventsGetById({
    pathParams: { id: eventId }
  });

  const [startDate, endDate] = useMemo(() => data?.result ? [
    new Date(data.result.startDate),
    new Date(data.result.endDate)
  ] : [undefined, undefined], [event]);

  if (!data?.result) return "Event not found";

  return (
    <main className='max-w-6xl mx-auto grid grid-rows-2'>
      <div>
        {data.result.images.length > 0 && <img src={data.result.images[0].originalUrl} />}
      </div>

      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
          <h1>{data.result.title}</h1>
          <p>{data.result.description}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <div className="flex flex-wrap gap-2">
            {data.result.categories.map(c => (
              <span key={c.id} className="border text-sm text-muted-foreground rounded-full py-1 px-2">{c.name}</span>
            ))}
          </div>

          <div className="flex gap-2 items-center text-muted-foreground">
            <MapPinIcon className="size-4" />
            <p className="">{data.result.location.street}, {data.result.location.zip} {data.result.location.city}</p>
          </div>

          <div className="flex justify-center gap-1 text-muted-foreground">
            <ClockIcon className={"size-4"} />
            <div className='flex gap-1'>
              {startDate && <p>{startDate?.formatDateTime().replaceAll(".", "/")}</p>}
              {startDate && endDate && "-"}
              {endDate && <p>{endDate.formatDateTime().replaceAll(".", "/")}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
