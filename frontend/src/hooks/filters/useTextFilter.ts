import {useState} from "react";
import {Option} from "@/types/common.types";

type ValueType = Option<string>;

export type UseTextFilterHook = ReturnType<typeof useTextFilter>;

export function useTextFilter() {
  const [value, setValue] = useState<ValueType>(null);

  return {
    filter: value,
    setFilter: (newValue: ValueType) => setValue(newValue),
    clearFilter: () => setValue(null),
  }
}
