import * as React from 'react'
import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { View, View2 } from "@/components/layout/View";
import { PaginationContainer } from "@/components/DataDisplay/PaginationContainer";
import { defaultPaginationProps, usePagination } from "@/hooks/usePagination";
import { EventsList } from "@/components/events/EventsList";
import { EventFilterContainer } from "@/components/events/EventFilterContainer";
import { EventFiltersProvider, useEventFilters } from "@/context/eventFilters/EventFiltersContext";
import { useEventsGetAll } from "@/endpoints/gubenComponents";
import { Pages } from "@/routes/admin/_layout/pages";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapComponent } from "@/components/home/MapComponent";

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
  const {t} = useTranslation("events");

  const {filters} = useEventFilters();
  const {data: eventsData} = useEventsGetAll({
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
    <View2>
      <View2.Header pageKey={Pages.Events}>
        <div className={"flex gap-1"}>
          {t("CitizenInformationText")}
          <Dialog>
            <DialogTrigger>
              <a className={"underline"}>
                {t("ClickHere")}
              </a>
            </DialogTrigger>
            <DialogContent className="w-5/6 max-w-full h-5/6 p-1 pt-12">
              <MapComponent src={"https://www.sessionnet.guben.de/buergerinfo"} className={"w-auto"} />
            </DialogContent>
          </Dialog>
        </div>
      </View2.Header>

      <View2.Content>
        <PaginationContainer
          nextPage={nextPage} previousPage={previousPage} setPageIndex={setPageIndex}
          setPageSize={setPageSize} total={total} pageCount={pageCount} pageSize={pageSize}
          page={page}
        >
          <EventFilterContainer/>
          <EventsList events={eventsData?.results}/>
        </PaginationContainer>
      </View2.Content>
    </View2>
);
}
