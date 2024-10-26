import {useCallback, useState} from "react";
import {FilterController, UseFilterHook} from "@/types/filtering.types";
import {Option} from "@/types/common.types";

export interface CategoryFilterController extends FilterController {
  setCategory: (value: Option<string>) => void;
  category: string;
}

const queryDefinition = "filters[categories][Name][$eq]";

export const useCategoryFilter: UseFilterHook<CategoryFilterController> = (filters, setFilters) => {
  const [category, _setCategory] = useState<Option<string>>(null);

  const setCategory = useCallback((value: Option<string>) => {
    _setCategory(value);
    const newFilters = filters.filter(([k, _]) => k !== queryDefinition);
    if (value && value !== '') newFilters.push([queryDefinition, value]);
    setFilters([...newFilters]);
  }, []);

  const clearFilter = useCallback(() => setCategory(null), []);

  return {
    category,
    setCategory,
    clearFilter
  } as CategoryFilterController;
}
