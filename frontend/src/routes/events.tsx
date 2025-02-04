import * as React from 'react'
import {useEffect} from 'react'
import {createFileRoute} from '@tanstack/react-router'
import {View} from "@/components/layout/View";
import {PaginationContainer} from "@/components/DataDisplay/PaginationContainer";
import {defaultPaginationProps, usePagination} from "@/hooks/usePagination";
import {EventsList} from "@/components/events/EventsList";
import {EventFilterContainer} from "@/components/events/EventFilterContainer";
import {EventFiltersProvider, useEventFilters} from "@/context/eventFilters/EventFiltersContext";
import {useEventsGetAll} from "@/endpoints/gubenComponents";
import { Pages } from "@/routes/admin/_layout/pages";

export const Route = createFileRoute('/events')({
  component: WrappedComponent,
})

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
  const { data: eventsData } = useEventsGetAll({
    queryParams: {
      pageSize,
      pageNumber: page,
      ...filters
    }
  });

  useEffect(() => {
    setTotal(eventsData?.totalCount ?? defaultPaginationProps.total);
    setPageCount(eventsData?.pageCount ?? defaultPaginationProps.pageCount);
  }, [eventsData]);

  return (
    <View pageKey={Pages.Events}>
      <PaginationContainer
        nextPage={nextPage} previousPage={previousPage} setPageIndex={setPageIndex}
        setPageSize={setPageSize} total={total} pageCount={pageCount} pageSize={pageSize}
        page={page}
      >
        <EventFilterContainer/>
        <EventsList events={eventsData?.results}/>
      </PaginationContainer>
    </View>
  );
}
