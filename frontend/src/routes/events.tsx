import * as React from 'react'
import {useEffect, useMemo} from 'react'
import {createFileRoute} from '@tanstack/react-router'
import {View} from "@/components/layout/View";
import {PaginationContainer} from "@/components/DataDisplay/PaginationContainer";
import {defaultPaginationProps, usePagination} from "@/hooks/usePagination";
import {EventsList} from "@/components/events/EventsList";
import {EventFilterContainer} from "@/components/events/EventFilterContainer";
import {EventFiltersProvider, useEventFilters} from "@/context/eventFilters/EventFiltersContext";
import {HashMap} from "@/types/common.types";
import {useEventsGetAll} from "@/endpoints/gubenComponents";

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

  const queryParams = useMemo(() =>
    filters.reduce((acc: HashMap<string | number>, val) => {
      acc[val[0]] = val[1];
      return acc;
    }, {}
  ), [filters, page, pageSize]);

  const { data: eventsData } = useEventsGetAll({
    queryParams: {
      pageSize, pageNumber: page, ...queryParams
    }
  });

  useEffect(() => {
    setTotal(eventsData?.totalCount ?? defaultPaginationProps.total);
    setPageCount(eventsData?.pageCount ?? defaultPaginationProps.pageCount);
  }, [eventsData]);

  return (
    <View pageKey={"Events"}>
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
