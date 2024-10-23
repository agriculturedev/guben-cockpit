import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from "react";
import {controllers} from "./controllers";

type Filter = Record<string, string>;
type UpdateFiltersFn = () => void;

interface EventFiltersContext {
  filters: Filter[];
  updateFilters: UpdateFiltersFn;
  controllers: typeof controllers;
}

const EventFiltersContext = createContext<EventFiltersContext | undefined>(undefined);

interface EventFiltersProviderProps extends PropsWithChildren {}

export function EventFiltersProvider({children}: EventFiltersProviderProps) {
  const [filters, setFilters] = useState<Filter[]>([]);

  const updateFilters: UpdateFiltersFn = useCallback(() => {
    setFilters([]);
  }, []);

  const ctx: EventFiltersContext = {filters, updateFilters, controllers};
  return (
    <EventFiltersContext.Provider value={ctx}>
      {children}
    </EventFiltersContext.Provider>
  )
}

export function useEventFilters() {
  const context = useContext(EventFiltersContext);
  if(!context) throw new Error("Cannot use 'useEventFilters' hook outside of an 'EventFiltersContext'");
  return context;
}