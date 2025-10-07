import { PaginationContainer } from '@/components/DataDisplay/PaginationContainer'
import CitizenInformationSystemBanner from '@/components/events/citizenInformationSystemBanner'
import EventCard from '@/components/events/eventCard'
import EventIntegration from '@/components/events/eventIntegration'
import SortFilter, { SortOption, SortOrder } from '@/components/events/sortFilter'
import { CategoryFilter } from '@/components/filters/categoryFilter'
import { DateRangeFilter } from '@/components/filters/dateRangeFilter'
import { SearchFilter } from '@/components/filters/searchFilter'
import { useBookingGetPublicTenantIds, useEventsGetAll } from '@/endpoints/gubenComponents'
import { defaultPaginationProps, usePagination } from '@/hooks/usePagination'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryResponse, LocationResponse, EventImageResponse, EventResponse } from '@/endpoints/gubenSchemas'
import { DistanceFilter } from '@/components/filters/DistanceFilter'
import { useEventStore } from '@/stores/eventStore'
import { Language } from '@/utilities/i18n/Languages'
import i18next from 'i18next'
import { translateBatchedMultiple, translateHtmlBatchedMultiple } from '@/utilities/translateUtils'

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

//@TODO we chould refactor this and move eventIntegration into the backend and merge the Data in eventRepository
//so we always have 25 results per Page. But then we need to keep the Booking Events in Cache in Case someone
//wants to access them, which we definitly need to be careful with 
//Then all the Custom Filtering Stuff could also be removed
function RouteComponent() {
  const { t } = useTranslation(["common", "events"]);
  const bookingEvents = useEventStore((state) => state.events);
  const processedTenants = useEventStore((state) => state.processedTenants);
  const markProcessedTenants = useEventStore((state) => state.markProcessedTenants);

  const { data: tenantIds } = useBookingGetPublicTenantIds({});
  
  const [currentTenantIndex, setCurrentTenantIndex] = useState(0);

  const handleTenantDone = useCallback(() => {
    const currentTenant = tenantIds?.tenants[currentTenantIndex];
    if (currentTenant) {
      markProcessedTenants(currentTenant.tenantId);
    }

    const hasMoreTenants = currentTenantIndex < (tenantIds?.tenants?.length ?? 0) - 1;

    if (hasMoreTenants) {
      setCurrentTenantIndex(i => i + 1);
    } else {
      setLoading(false);
    }
  }, [currentTenantIndex, tenantIds?.tenants, markProcessedTenants]);

  const currentTenant = tenantIds?.tenants[currentTenantIndex];
  const shouldShowIntegration = currentTenant && !processedTenants.has(currentTenant.tenantId);

  useEffect(() => {
    if (shouldShowIntegration) {
      setLoading(true);
    }
  }, [shouldShowIntegration]);

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

  const [loading, setLoading] = useState(true);

  const normalizedEvents = bookingEvents.map(e => {
    const [startDateStr, endDateStr] = e.date.split(" - ");

    const start = startDateStr.replace(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");

    // End Date might only contain Time and not Date, if the event is only 1 day
    let end: string;
    if (endDateStr.includes('.')) {
      end = endDateStr.replace(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");
    } else {
      const startDate = startDateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/)?.[0];
      if (startDate) {
        const fullEndDate = `${startDate} ${endDateStr}`;
        end = fullEndDate.replace(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");
      } else {
        end = start;
      }
    }

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
      coordinates: e.coordinates,
      urls: [],
      categories: categories,
      images: images,
      published: true,
      isBookingEvent: true,
    };
  }) as (EventResponse & { isBookingEvent?: boolean })[];

  type FiltersType = z.infer<typeof filtersSchema>;

  //Filter Events from the Booking CMS
  function filterEvents(events: (EventResponse & { isBookingEvent?: boolean })[], filters: FiltersType) {
    return events.filter(event => {
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.distance && filters.distance > 0) {
        const cityCenterLat = 51.95042;
        const cityCenterLon = 14.7143;
        if (event.coordinates?.latitude && event.coordinates?.longitude) {
          const d = calculateDistanceInKm(
            cityCenterLat,
            cityCenterLon,
            event.coordinates.latitude,
            event.coordinates.longitude
          );
          if (d > filters.distance) return false;
        } else {
          return false;
        }
      }
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        const filterStart = filters.dateRange?.from ?? new Date(-8640000000000000);
        const filterEnd = filters.dateRange?.to ?? new Date(8640000000000000);

        if (!(eventStart <= filterEnd && eventEnd >= filterStart)) {
          return false;
        }
      }
      return true;
    });
  }

  const filteredNormalizedEvents = filterEvents(normalizedEvents, filters);

  const allEvents = mergeEventsWithCustom(data?.results ?? [], filteredNormalizedEvents);
  
  useEffect(() => {
    setTotal(allEvents.length ?? defaultPaginationProps.total);
    setPageCount(data?.pageCount ?? defaultPaginationProps.pageCount);
  }, [data]);

  const currentLang = i18next.language as Language;
  const [translationsReady, setTranslationsReady] = useState(false);

  useEffect(() => {
    setTranslationsReady(false);
    if (!shouldShowIntegration && currentLang !== "de") {
      const customEvents = (allEvents as (EventResponse & { isBookingEvent?: boolean })[])
        .filter(e => e.isBookingEvent);

      const translateAll = async () => {
        const descriptions = customEvents
          .map(e => e.description)
          .filter(desc => desc && desc.trim());
        
        if (descriptions.length > 0) {
          await translateHtmlBatchedMultiple(descriptions, currentLang);
        }

        const titles = customEvents
          .map(e => e.title)
          .filter(title => title && title.trim() !== '');

        if (titles.length > 0) {
          await translateBatchedMultiple([...new Set(titles)], currentLang);
        }
        setTranslationsReady(true);
      };

      translateAll();
    } else {
      setTranslationsReady(true);
    }
  }, [shouldShowIntegration, currentLang]);

  return (
    <main className="relative space-y-8 mb-8">
      {loading && <Skeleton />}
      { shouldShowIntegration && (
        <EventIntegration
          key={`${currentTenant.tenantId}`}
          tenantId={currentTenant.tenantId}
          setLoading={setLoading}
          onDone={handleTenantDone} />
      )}
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
                  new Set(bookingEvents.flatMap(e => e.flags ?? []))
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
          {translationsReady
            ? allEvents.map(r => <EventCard key={r.id} event={r} />)
            : Array.from({ length: pageSize }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full h-48 sm:h-60 md:h-64 lg:h-72 rounded-md p-4 mb-4"
                />
              ))
        }
        </PaginationContainer>
      </section>
    </main>
  )
}

function toRadians(angle: number): number {
  return (Math.PI * angle) / 180.0;
}

function mergeEventsWithCustom(
  backendEvents: EventResponse[],
  bookingEvents: (EventResponse & { isBookingEvent?: boolean })[]
) {
  if (!backendEvents.length) return [...bookingEvents];

  const earliest = new Date(backendEvents[0].startDate).getTime();
  const latest = new Date(backendEvents[backendEvents.length - 1].startDate).getTime();

  const filteredCustom = bookingEvents.filter(event => {
    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();

    // only filtered Events should end up here
    if (backendEvents.length < 25) {
      return true;
    }

    return start >= earliest && start <= latest;
  });

  const combined = [...backendEvents, ...filteredCustom];
  combined.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return combined;
}

function calculateDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}