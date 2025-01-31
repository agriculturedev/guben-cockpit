import {
  createContext,
  PropsWithChildren,
  useContext, useMemo,
} from "react";
import {EventsGetAllQueryParams} from "@/endpoints/gubenComponents";
import {useTextFilter, UseTextFilterHook} from "@/hooks/filters/useTextFilter";
import {useDateRangeFilter, UseDateRangeFilterHook} from "@/hooks/filters/useDateRangeFilter";
import {useSortingFilter, UseSortingFilterHook} from "@/hooks/filters/useSortingFilter";
import {useMultiComboFilter, UseMultiComboFilterHook} from "@/hooks/filters/useMultiComboFilter";

interface EventFilterControllers {
  title: UseTextFilterHook;
  dateRange: UseDateRangeFilterHook;
  sorting: UseSortingFilterHook;
  location: UseMultiComboFilterHook;
  category: UseTextFilterHook;
}

interface EventFiltersContext {
  filters: EventsGetAllQueryParams;
  controllers: EventFilterControllers;
}

const EventFiltersContext = createContext<EventFiltersContext | undefined>(undefined);

export function EventFiltersProvider({children}: PropsWithChildren) {
  const controllers = {
    title: useTextFilter(),
    dateRange: useDateRangeFilter(),
    sorting: useSortingFilter(),
    location: useMultiComboFilter(["Guben"]),
    category: useTextFilter(),
  };

  const filters: EventsGetAllQueryParams = useMemo(() => {
    const retVal = {
      title: controllers.title.filter ?? undefined,
      location: controllers.location.filters?.join(",") ?? undefined,
      category: controllers.category.filter ?? undefined,
      startDate: controllers.dateRange.filter.startDate?.toIsoDate() ?? undefined,
      endDate: controllers.dateRange.filter.endDate?.toIsoDate() ?? undefined,
      ordering: controllers.sorting.filter.direction ?? undefined
      // TODO @Kilian: fix these filters with type constraints
      // sortBy: controllers.sorting.filter.field ?? undefined,
    }

    let k: keyof typeof retVal;
    for(k in retVal) if(retVal[k] === undefined) delete retVal[k];

    return retVal;
  }, [controllers]);

  return (
    <EventFiltersContext.Provider value={{filters, controllers}}>
      {children}
    </EventFiltersContext.Provider>
  )
}

export function useEventFilters() {
  const context = useContext(EventFiltersContext);
  if (!context) throw new Error("Cannot use 'useEventFilters' hook outside of an 'EventFiltersContext'");
  return context;
}
