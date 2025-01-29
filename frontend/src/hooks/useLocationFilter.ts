import {FilterController, UseFilterHook} from "@/types/filtering.types";
import {useCallback, useMemo, useState} from "react";
import {useLocationsGetAll} from "@/endpoints/gubenComponents";
import {LocationResponse} from "@/endpoints/gubenSchemas";

type FilterType = string[]

export interface LocationFilterController extends FilterController {
  setLocations: (locations: FilterType) => void;
  locations: FilterType;
}

export const useLocationFilter: UseFilterHook<LocationFilterController> = (
  filters,
  setFilters,
  queryDefinition
) => {

  const {data} = useLocationsGetAll({});
  const [locations, _setLocations] = useState<string[]>([]);

  const locationLookup: Record<string, LocationResponse> = useMemo(() => {
    return data?.locations?.reduce((acc, val) => {
      acc[val.id] = val;
      return acc;
    }, {} as Record<string, LocationResponse>) ?? {};
  }, [data?.locations]);

  const updateFilters = useCallback((newItems: FilterType) => {
    const oldFilters = filters.filter(([def, _]) => def !== queryDefinition);
    for(let i of newItems) {
      const loc = locationLookup[i];
      if(loc) oldFilters.push([queryDefinition, `${loc.name}, ${loc.city}`]);
    }
    setFilters([...oldFilters]);
  }, []);

  const setLocations = useCallback((locations: FilterType) => {
    _setLocations(locations);
    updateFilters(locations);
  }, []);

  const clearFilter = useCallback(() => setLocations([]), []);

  return {
    locations,
    setLocations,
    clearFilter
  };
}
