import {useCallback, useState} from "react";
import {FilterController, UseFilterHook} from "@/types/filtering.types";

export interface SorterController extends FilterController {
  setSortOption: (sortOption: string | null) => void;
  sortOption: string | null;
}

const queryDefinition = "sort[0]";

export const useSorter: UseFilterHook<SorterController> = (filters, setFilters) => {
  const [sortOption, _setSortOption] = useState<string | null>('');

  const setSortOption = useCallback((value: string | null) => {
    _setSortOption(value);
    const newFilters = filters.filter(([definition, _]) => definition !== queryDefinition);

    if (value != null)
      newFilters.push([queryDefinition, value]);
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
  TITLE_ASC: "title:asc",
  TITLE_DESC: "title:desc",
  DATE_ASC: "startDate:asc",
  DATE_DESC: "startDate:desc",
}