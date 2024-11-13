import {useCallback, useState} from "react";
import {FilterController, UseFilterHook} from "@/types/filtering.types";

export interface LocationFilterController extends FilterController {
  setSearchText: (searchText: string) => void;
  searchText: string;
}

const queryDefinitions = [
  "filters[$and][0][location][$or][0][City][$containsi]",
  "filters[$and][0][location][$or][1][Name][$containsi]",
  "filters[$and][0][location][$or][2][Street][$containsi]",
  "filters[$and][0][location][$or][3][Zip][$containsi]"
];

export const useLocationFilter: UseFilterHook<LocationFilterController> = (filters, setFilters) => {
  const [searchText, _setSearchText] = useState<string>('');

  const setSearchText = useCallback((value: string) => {
    _setSearchText(value);
    let newFilters = filters.filter(([definition, _]) => !queryDefinitions.includes(definition));
    if (value != "") newFilters = newFilters.concat(queryDefinitions.map(def => [def, value]));
    console.log(newFilters);
    setFilters([...newFilters]);
  }, []);

  const clearFilter = useCallback(() => setSearchText(""), []);

  return {
    searchText,
    setSearchText,
    clearFilter
  };
}