import {useCallback, useState} from "react";
import {FilterController, UseFilterHook} from "@/types/filtering.types";

export interface TextFilterController extends FilterController {
  setSearchText: (searchText: string) => void;
  searchText: string;
}

export const useTextFilter: UseFilterHook<TextFilterController> = (filters, setFilters, queryDefinition) => {
  const [searchText, _setSearchText] = useState<string>('');

  const setSearchText = useCallback((value: string) => {
    _setSearchText(value);
    const newFilters = filters.filter(([definition, _]) => definition !== queryDefinition);
    if (value != "") newFilters.push([queryDefinition, value]);
    setFilters([...newFilters]);
  }, []);

  const clearFilter = useCallback(() => setSearchText(""), []);

  return {
    searchText,
    setSearchText,
    clearFilter
  };
}
