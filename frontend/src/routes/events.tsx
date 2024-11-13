import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {createFileRoute} from '@tanstack/react-router'
import {useGetEvents, useGetEventView} from "@/endpoints/gubenProdComponents";
import {View} from "@/components/layout/View";
import {PaginationContainer} from "@/components/DataDisplay/PaginationContainer";
import {defaultPaginationProps, usePagination} from "@/hooks/usePagination";
import {EventsList} from "@/components/events/EventsList";
import {EventFilterContainer} from "@/components/events/EventFilterContainer";
import {EventFiltersProvider, useEventFilters} from "@/context/eventFilters/EventFiltersContext";
import {HashMap} from "@/types/common.types";

export const Route = createFileRoute('/events')({
  component: WrappedComponent,
})

export interface Filters {
}

function WrappedComponent() {
  return (
    <EventFiltersProvider>
      <EventComponent/>
    </EventFiltersProvider>
  )
}

function EventComponent() {
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

  const {filters} = useEventFilters();

  const queryParams = useMemo(() =>
    filters.reduce((acc: HashMap<string | number>, val) => {
      acc[val[0]] = val[1];
      return acc;
    }, {
      "pagination[pageSize]": pageSize,
      "pagination[page]": page,
      "populate[0]": "categories",
      "populate[1]": "location"
    }
  ), [filters, page, pageSize]);

  const {
    data: eventsData
  } = useGetEvents({queryParams: queryParams}, {});

  const {
    data: eventViewData,
    isLoading: eventViewIsLoading
  } = useGetEventView({queryParams: {}});

  useEffect(() => {
    // setPageSize(eventsData?.meta?.pagination?.pageSize ?? defaultPaginationProps.pageSize);
    // setPageIndex(eventsData?.meta?.pagination?.page ?? defaultPaginationProps.page);
    setTotal(eventsData?.meta?.pagination?.total ?? defaultPaginationProps.total);
    setPageCount(eventsData?.meta?.pagination?.pageCount ?? defaultPaginationProps.pageCount);
  }, [eventsData]);

  return (
    <View
      title={eventViewData?.data?.attributes?.Title}
      description={eventViewData?.data?.attributes?.Description}
      isLoading={eventViewIsLoading}
    >
      <PaginationContainer
        nextPage={nextPage} previousPage={previousPage} setPageIndex={setPageIndex}
        setPageSize={setPageSize} total={total} pageCount={pageCount} pageSize={pageSize}
        page={page}
      >
        <EventFilterContainer/>
        <EventsList events={eventsData?.data}/>
      </PaginationContainer>
    </View>
  );
}
