import {useCallback, useState} from "react";
import { FilterController, QueryFilter, UseFilterHook } from "@/types/filtering.types";

export interface SorterController extends FilterController {
  setSortOption: (sortOption: string | null) => void;
  sortOption: string | null;
}

const queryDefinitions = [
  "sortBy",
  "sortDirection",
];

export const useSorter: UseFilterHook<SorterController> = (filters, setFilters) => {
  const [sortOption, _setSortOption] = useState<string | null>('');

  const setSortOption = useCallback((value: string | null) => {
    _setSortOption(value);
    const newFilters = filters.filter(([k, _]) => !queryDefinitions.includes(k));

    if (value != null)
    {
      const sorting = value.split(":");
      const sortBy = sorting[0];
      const sortDirection = sorting[1];

      console.log(sortBy, sortDirection)
      newFilters.push([queryDefinitions[0],  sortBy] as QueryFilter);
      newFilters.push([queryDefinitions[1],  sortDirection] as QueryFilter);
    }
    setFilters([...newFilters]);
  }, []);

  const clearFilter = useCallback(() => setSortOption(""), []);

  return {
    sortOption,
    setSortOption,
    clearFilter
  };
}

export const SORT_OPTIONS = {
  NONE: "none",
  TITLE_ASC: "title:ascending",
  TITLE_DESC: "title:descending",
  DATE_ASC: "startDate:ascending",
  DATE_DESC: "startDate:descending",
}
