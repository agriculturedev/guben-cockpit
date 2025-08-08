import { PaginationContainer } from '@/components/DataDisplay/PaginationContainer'
import CitizenInformationSystemBanner from '@/components/events/citizenInformationSystemBanner'
import EventCard from '@/components/events/eventCard'
import EventIntegration from '@/components/events/eventIntegration'
import SortFilter, { SortOption, SortOrder } from '@/components/events/sortFilter'
import { CategoryFilter } from '@/components/filters/categoryFilter'
import { DateRangeFilter } from '@/components/filters/dateRangeFilter'
import { LocationsFilter } from '@/components/filters/locationsFilter'
import { SearchFilter } from '@/components/filters/searchFilter'
import { useEventsGetAll } from '@/endpoints/gubenComponents'
import { defaultPaginationProps, usePagination } from '@/hooks/usePagination'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryResponse, LocationResponse, EventImageResponse, EventResponse } from '@/endpoints/gubenSchemas'
import { DistanceFilter } from '@/components/filters/DistanceFilter'

type BookingEvent = {
  title: string;
  date: string;
  organizer: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  teaser: string;
  bkid: string;
  details?: EventDetails;
  imgUrl: string;
  flags?: string[];
};

type EventDetails = {
  longDescription?: string;
  eventLocation?: string;
  eventLocationEmail?: string;
  eventOrganizer?: string;
  agenda?: string[];
  teaserImage?: string;
  street?: string;
  zip?: string;
  city?: string;
};

export const Route = createFileRoute('/events/')({
  component: RouteComponent,
})

const filtersSchema = z.object({
  distance: z.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional()
  }).optional(),
  sortBy: z.nativeEnum(SortOption).optional(),
  ordering: z.nativeEnum(SortOrder).optional()
}).default({});

function RouteComponent() {
  const { t } = useTranslation(["common", "events"]);

  const {
    page,
    pageCount,
    total,
    pageSize,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    setTotal,
    setPageCount
  } = usePagination();

  const [filters, setFilters] = useState(filtersSchema.parse({
    dateRange: { from: new Date() },
    distance: 10,
  }));

  const { data } = useEventsGetAll({
    queryParams: {
      pageSize: pageSize,
      pageNumber: page,
      ...filters.search && { title: filters.search },
      ...filters.distance && { distance: filters.distance },
      ...filters.category && { category: filters.category },
      ...filters.dateRange?.from && { startDate: filters.dateRange.from.toDateString() },
      ...filters.dateRange?.to && { endDate: filters.dateRange.to.toDateString() },
      ...filters.sortBy && { sortBy: filters.sortBy },
      ...filters.ordering && { ordering: filters.ordering }
    },
  }, { retry: false });

  const handleFilterChange = (newFilters: Partial<{ [k in keyof typeof filters]: unknown }>) => {
    const updated = { ...filters, ...newFilters };
    const parsed = filtersSchema.safeParse(updated);
    if (parsed.success) setFilters(parsed.data);
    else setFilters(filtersSchema.parse(undefined));
  };

  useEffect(() => {
    setTotal(data?.totalCount ?? defaultPaginationProps.total);
    setPageCount(data?.pageCount ?? defaultPaginationProps.pageCount);
  }, [data]);

  const [loading, setLoading] = useState(true);

  const [customEvents, setBookingEvents] = useState<BookingEvent[]>([]);

  const normalizedEvents = customEvents.map(e => {
    const [startDateStr, endDateStr] = e.date.split(" - ");

    const start = startDateStr.replace(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");

    const end = endDateStr.replace(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");

    const location: LocationResponse = {
      id: crypto.randomUUID(),
      name: e.details?.eventLocation || "",
      city: e.details?.city,
      street: e.details?.street,
      telephoneNumber: e.contactPhone,
      fax: null,
      email: e.contactEmail,
      website: null,
      zip: e.details?.zip,
    };

    const categories: CategoryResponse[] = (e.flags ?? []).map(f => ({
      id: crypto.randomUUID(),
      name: f,
    }));

    const images: EventImageResponse[] = e.imgUrl
      ? [{
          thumbnailUrl: e.details?.teaserImage || e.imgUrl,
          previewUrl: e.imgUrl,
          originalUrl: e.imgUrl,
        }]
      : [];

    return {
      id: e.bkid,
      eventId: crypto.randomUUID(),
      terminId: crypto.randomUUID(),
      title: e.title,
      description: e.details?.longDescription || e.teaser,
      isHtmlDescription: true,
      startDate: start,
      endDate: end,
      location,
      coordinates: undefined,
      urls: [],
      categories: categories,
      images: images,
      published: true,
      isBookingEvent: true,
    };
  }) as (EventResponse & { isBookingEvent?: boolean })[];;

  type FiltersType = z.infer<typeof filtersSchema>;

  //Filter Events from the Booking CMS
  function filterEvents(events: (EventResponse & { isBookingEvent?: boolean })[], filters: FiltersType) {
    return events.filter(event => {
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      //if (filters.location.length > 0 && (!event.location || !filters.location.includes(event.location.city ?? ""))) {
      //  return false;
      //}
      if (filters.category && !event.categories.some(c => c.name === filters.category)) {
        return false;
      }
      if (filters.dateRange?.from) {
        const eventStart = new Date(event.startDate);
        if (eventStart < filters.dateRange.from) return false;
      }
      if (filters.dateRange?.to) {
        const eventEnd = new Date(event.endDate);
        if (eventEnd > filters.dateRange.to) return false;
      }
      return true;
    });
  }

  const filteredNormalizedEvents = filterEvents(normalizedEvents, filters);

  const allEvents = [
    ...(data?.results ?? []),
    ...filteredNormalizedEvents
  ];

  return (
    <main className="relative space-y-8 mb-8">
      {loading && <Skeleton />}
      <EventIntegration setLoading={setLoading} setEvents={setBookingEvents} />
      <CitizenInformationSystemBanner />

      <section className='space-y-8 max-w-7xl mx-auto'>
        <h1 className='text-5xl text-center'>{t("events:PageTitle")}</h1>

        <div className='flex items-end gap-2'>
          <div className='w-full grid grid-cols-5 gap-2'>
            <SearchFilter
              className={"col-span-2"}
              value={filters.search ?? null}
              onChange={v => handleFilterChange({ "search": v })}
            />
            <CategoryFilter
              value={filters.category ?? null}
              onChange={v => handleFilterChange({ category: v })}
              categories={
                Array.from(
                  new Set(customEvents.flatMap(e => e.flags ?? []))
                ).map(name => ({ id: name, name }))
              }
            />
            <DistanceFilter
              value={filters.distance?.toString()}
              onChange={(v) => {
                const num = v ? parseInt(v) : undefined;
                handleFilterChange({ distance: num });
              }}
            />
            <DateRangeFilter
              value={filters.dateRange}
              onChange={range => handleFilterChange({ "dateRange": range })}
            />
          </div>

          <SortFilter
            option={filters.sortBy}
            order={filters.ordering}
            onChange={(option, order) => handleFilterChange({
              "sortBy": option,
              "ordering": order
            })
            }
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto flex flex-col gap-4">
        <PaginationContainer
          nextPage={nextPage}
          previousPage={previousPage}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          total={total}
          pageCount={pageCount}
          pageSize={pageSize}
          page={page}
        >
          {allEvents.map(r => <EventCard key={r.id} event={r} />)}
        </PaginationContainer>
      </section>
    </main>
  )
}
