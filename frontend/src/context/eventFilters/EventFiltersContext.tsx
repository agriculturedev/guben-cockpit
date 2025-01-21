import {
  createContext,
  PropsWithChildren,
  useContext, useMemo,
  useState
} from "react";
import {QueryFilter} from "@/types/filtering.types";
import {TextFilterController, useTextFilter} from "@/hooks/useTextFilter";
import {DateFilterController, useDateFilter} from "@/hooks/useDateFilter";
import {CategoryFilterController, useCategoryFilter} from "@/hooks/useCategoryFilter";
import { LocationFilterController, useLocationFilter } from "@/hooks/useLocationFilter";
import { SorterController, useSorter } from "@/hooks/useSorter";


interface EventFiltersContext {
  filters: QueryFilter[];
  controllers: EventFiltersControllers;
}

interface EventFiltersControllers {
  sortController: SorterController,
  textController: TextFilterController,
  dateController: DateFilterController,
  categoryController: CategoryFilterController,
  locationController: LocationFilterController
}

const EventFiltersContext = createContext<EventFiltersContext | undefined>(undefined);

interface EventFiltersProviderProps extends PropsWithChildren {
}

export function EventFiltersProvider({children}: EventFiltersProviderProps) {
  const [sorting, setSorting] = useState<QueryFilter[]>([]);
  const [textFilters, setTextFilters] = useState<QueryFilter[]>([]);
  const [dateFilters, setDateFilters] = useState<QueryFilter[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<QueryFilter[]>([]);
  const [locationFilters, setLocationFilters] = useState<QueryFilter[]>([]);

  const filters = useMemo(() => [
    ...sorting,
    ...textFilters,
    ...dateFilters,
    ...categoryFilters,
    ...locationFilters
  ], [
    sorting,
    textFilters,
    dateFilters,
    categoryFilters,
    locationFilters
  ]);

  const controllers: EventFiltersControllers = {
    sortController: useSorter(sorting, setSorting),
    textController: useTextFilter(textFilters, setTextFilters),
    dateController: useDateFilter(dateFilters, setDateFilters),
    categoryController: useCategoryFilter(categoryFilters, setCategoryFilters),
    locationController: useLocationFilter(locationFilters, setLocationFilters),
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