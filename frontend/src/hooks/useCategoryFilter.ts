import {useCallback, useState} from "react";
import {FilterController, UseFilterHook} from "@/types/filtering.types";
import {Option} from "@/types/common.types";
import {CategoryResponse} from "@/endpoints/gubenSchemas";

export interface CategoryFilterController extends FilterController {
  setCategory: (value: Option<CategoryResponse>) => void;
  category: CategoryResponse;
}

export const useCategoryFilter: UseFilterHook<CategoryFilterController> = (filters, setFilters, queryDefinition) => {
  const [category, _setCategory] = useState<Option<CategoryResponse>>(null);

  const setCategory = useCallback((value: Option<CategoryResponse>) => {
    console.log(value);
    _setCategory(value);
    const newFilters = filters.filter(([k, _]) => k !== queryDefinition);
    if (value && value.id !== '') newFilters.push([queryDefinition, value.id]);
    setFilters([...newFilters]);
  }, []);

  const clearFilter = useCallback(() => setCategory(null), []);

  return {
    category,
    setCategory,
    clearFilter
  } as CategoryFilterController;
}
