import {useState} from "react";

export type UseMultiComboFilterHook = ReturnType<typeof useMultiComboFilter>;

type ValueType = string[];

export const useMultiComboFilter = (defaultValues?: ValueType) => {
  const [filterValues, setFilterValues] = useState<ValueType>(defaultValues ?? []);

  return {
    filters: filterValues,
    setFilter: (values: ValueType) => setFilterValues(values),
    clearFilter: () => setFilterValues([]),
  }
}
