import {useCallback, useState} from "react";
import {FilterController, UseFilterHook} from "@/types/filtering.types";

export interface LocationFilterController extends FilterController {
  setSearchText: (searchText: string) => void;
  searchText: string;
}

const queryDefinitions = [
  "filters[$or][0][location][Name][$contains]",
  "filters[$or][0][location][City][$contains]",
  "filters[$or][0][location][Street][$contains]",
  "filters[$or][0][location][Zip][$contains]"
];

export const useLocationFilter: UseFilterHook<LocationFilterController> = (filters, setFilters) => {
  const [searchText, _setSearchText] = useState<string>('');

  const setSearchText = useCallback((value: string) => {
    _setSearchText(value);
    const newFilters = filters.filter(([definition, _]) => !queryDefinitions.includes(definition));
    if (value != "") newFilters.concat(queryDefinitions.map(def => [def, value]));
    setFilters([...newFilters]);
  }, []);

  const clearFilter = useCallback(() => setSearchText(""), []);

  return {
    searchText,
    setSearchText,
    clearFilter
  };
}