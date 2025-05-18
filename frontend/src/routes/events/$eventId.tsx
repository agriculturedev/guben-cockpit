import { Button } from '@/components/ui/button';
import { useEventsGetById } from '@/endpoints/gubenComponents';
import { cn } from '@/lib/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/events/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

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
    <main className='relative'>
      <Button
        variant="ghost"
        className='z-10 text-white gap-2 absolute top-4 left-4 flex items-center hover:bg-none'
        onClick={() => navigate({to: "/events"})}
      >
        <ArrowLeftIcon className='size-4'/>
        <p>All events</p>
      </Button>
      {<ImageSection url={data.result.images.length > 0 ? data.result.images[0].originalUrl : "/images/stadt-guben.jpg"} />}

      <section className={'max-w-4xl mx-auto space-y-8 translate-y-[-96px]'}>
        <div className='mx-auto p-8 rounded-md bg-white space-y-2 shadow-lg'>
          <div className='flex gap-2'>
            {data.result.categories.map(c => (
              <p key={c.id} className='px-4 border-neutral-300 border rounded-full'>{c.name}</p>
            ))}
          </div>

          <h1 className='font-bold'>{data.result.title}</h1>

          <div className='space-y-1'>
            <p className='flex gap-2 flex-nowrap items-center text-neutral-500'><ClockIcon className='size-4' /> Date and Time</p>
            <p className='flex gap-1 text-neutral-800'>
              {startDate && <p>{startDate?.formatDateTime().replaceAll(".", "/")}</p>}
              {startDate && endDate && "-"}
              {endDate && <p>{endDate.formatDateTime().replaceAll(".", "/")}</p>}
            </p>
          </div>

          <div className='space-y-1'>
            <p className='flex flex-nowrap items-center gap-2 text-neutral-500'><MapPinIcon className='size-4' /> Location</p>
            <p className='flex gap-1'>{`${data.result.location.street}, ${data.result.location.zip} ${data.result.location.city} (${data.result.location.name})`}</p>
          </div>
        </div>

        <div>
          <div className='w-full lg:w-1/2 space-y-2'>
            <h2 className='font-bold'>Event details</h2>
            <p className='text-neutral-600'>{data.result.description}</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function ImageSection({ url }: { url: string }) {
  return (
    <div className='relative h-[24em]'>
      <div className='absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)]' />
      <img src={url} className='h-full w-full object-cover' />
    </div>
  )
}
