import { Button } from '@/components/ui/button';
import { useEventsGetById } from '@/endpoints/gubenComponents';
import { CategoryResponse } from '@/endpoints/gubenSchemas';
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { ArrowLeftIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';

export const Route = createFileRoute('/events/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const { eventId } = Route.useParams();

  const router = useRouter();
  const eventFromState = (router.state.location.state as any)?.event;
  const { data: fetchedData } = !eventFromState
    ? useEventsGetById({ pathParams: { id: eventId } })
    : { data: undefined };

  const data = eventFromState || fetchedData?.result;

  const [startDate, endDate] = useMemo(() => data ? [
    new Date(data.startDate),
    new Date(data.endDate)
  ] : [undefined, undefined], [event]);

  if (!data) return "Event not found";

  return (
    <main className='relative'>
      <Button
        variant="ghost"
        className='z-10 text-white gap-2 absolute top-4 left-4 flex items-center hover:bg-none'
        onClick={() => navigate({to: "/events"})}
      >
        <ArrowLeftIcon className='size-4'/>
        <p>{t("AllEvents")}</p>
      </Button>
      {<ImageSection url={data.images.length > 0 ? data.images[0].originalUrl : "/images/stadt-guben.jpg"} />}

      <section className={'max-w-4xl mx-auto space-y-8 translate-y-[-96px]'}>
        <div className='mx-auto p-8 rounded-md bg-white space-y-2 shadow-lg'>
          <div className='flex gap-2'>
            {data.categories.map((c: CategoryResponse) => (
              <p key={c.id} className='px-4 border-neutral-300 border rounded-full'>{c.name}</p>
            ))}
          </div>

          <h1 className='font-bold'>{data.title}</h1>

          <div className='space-y-1'>
            <p className='flex gap-2 flex-nowrap items-center text-neutral-500'><ClockIcon className='size-4' /> {t("DateAndTime")}</p>
            <p className='flex gap-1 text-neutral-800'>
              {startDate && <p>{startDate?.formatDateTime()}</p>}
              {startDate && endDate && "-"}
              {endDate && <p>{endDate.formatDateTime()}</p>}
            </p>
          </div>

          <div className='space-y-1'>
            <p className='flex flex-nowrap items-center gap-2 text-neutral-500'><MapPinIcon className='size-4' /> {t("Location")}</p>
            <p className='flex gap-1'>{`${data.location.street}, ${data.location.zip} ${data.location.city} (${data.location.name})`}</p>
          </div>
        </div>

        <div>
          <div className='w-full lg:w-1/2 space-y-2'>
            <h2 className='font-bold'>{t("EventDetails")}</h2>
              {(data as any)?.isBookingEvent ? (
                <div className="text-muted-foreground line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description) }} />
              ) : (
                <p className="text-neutral-600">{data.description}</p>
              )}
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
