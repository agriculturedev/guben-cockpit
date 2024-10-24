import {createContext, PropsWithChildren, useContext, useState} from "react";
import {QueryFilter} from "@/types/filtering.types";
import {TextFilterController, useTextFilter} from "@/hooks/useTextFilter";
import {DateFilterController, useDateFilter} from "@/hooks/useDateFilter";
import {CategoryFilterController, useCategoryFilter} from "@/hooks/useCategoryFilter";

interface EventFiltersContext {
  filters: QueryFilter[];
  controllers: EventFiltersControllers
}

interface EventFiltersControllers {
  textController: TextFilterController,
  dateController: DateFilterController,
  categoryController: CategoryFilterController
}

const EventFiltersContext = createContext<EventFiltersContext | undefined>(undefined);

interface EventFiltersProviderProps extends PropsWithChildren {
}

export function EventFiltersProvider({children}: EventFiltersProviderProps) {
  const [filters, setFilters] = useState<QueryFilter[]>([]);

  const controllers: EventFiltersControllers = {
    textController: useTextFilter(filters, setFilters),
    dateController: useDateFilter(filters, setFilters),
    categoryController: useCategoryFilter(filters, setFilters),
  };

  const ctx: EventFiltersContext = {filters, controllers};
  return (
    <EventFiltersContext.Provider value={ctx}>
      {children}
    </EventFiltersContext.Provider>
  )
}

export function useEventFilters() {
  const context = useContext(EventFiltersContext);
  if (!context) throw new Error("Cannot use 'useEventFilters' hook outside of an 'EventFiltersContext'");
  return context;
}