import { PaginationContainer } from '@/components/DataDisplay/PaginationContainer'
import CitizenInformationSystemBanner from '@/components/events/citizenInformationSystemBanner'
import EventCard from '@/components/events/eventCard'
import { CategoryFilter } from '@/components/filters/categoryFilter'
import { LocationsFilter } from '@/components/filters/locationsFilter'
import { DateRangeFilter } from '@/components/filters/rangeFilter'
import { SearchFilter } from '@/components/filters/searchFilter'
import { useEventsGetAll } from '@/endpoints/gubenComponents'
import { defaultPaginationProps, usePagination } from '@/hooks/usePagination'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

export const Route = createFileRoute('/events/')({
  component: RouteComponent,
})

const filtersSchema = z.object({
  location: z.array(z.string()).default([]),
  search: z.string().optional(),
  category: z.string().optional(),
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional()
  }).optional()
}).default({
  location: []
});

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

  const [filters, setFilters] = useState(filtersSchema.parse({}));

  const { data } = useEventsGetAll({
    queryParams: {
      pageSize: pageSize,
      pageNumber: page,
      ...filters.search && { title: filters.search },
      ...filters.location.length > 0 && { location: filters.location.join(";") },
      ...filters.category && { category: filters.category },
      ...filters.dateRange?.from && { startDate: filters.dateRange.from.toIsoDate() },
      ...filters.dateRange?.to && { endDate: filters.dateRange.to.toIsoDate() },
    },
  }, { retry: false });

  const handleFilterChange = (key: keyof typeof filters, value: unknown) => {
    console.log(value);
    const updated = { ...filters, [key]: value };
    const parsed = filtersSchema.safeParse(updated);
    if (parsed.success) setFilters(parsed.data);
    else setFilters(filtersSchema.parse(undefined));
  };

  useEffect(() => {
    setTotal(data?.totalCount ?? defaultPaginationProps.total);
    setPageCount(data?.pageCount ?? defaultPaginationProps.pageCount);
  }, [data]);

  return (
    <main className="relative space-y-8 mb-8">
      <CitizenInformationSystemBanner />

      <section className='space-y-8 max-w-7xl mx-auto'>
        <h1 className='text-5xl text-center'>{t("events:PageTitle")}</h1>

        <div className='grid grid-cols-5 gap-2'>
          <SearchFilter
            className={"col-span-2"}
            value={filters.search ?? null}
            onChange={v => handleFilterChange("search", v)}
          />

          <CategoryFilter
            value={filters.category ?? null}
            onChange={v => handleFilterChange("category", v)}
          />

          <LocationsFilter
            value={filters.location}
            onChange={v => handleFilterChange("location", v)}
          />

          <DateRangeFilter
            value={filters.dateRange}
            onChange={range => handleFilterChange("dateRange", range)}
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
          {data?.results.map(r => <EventCard key={r.id} event={r} />)}
        </PaginationContainer>
      </section>
    </main>
  )
}
