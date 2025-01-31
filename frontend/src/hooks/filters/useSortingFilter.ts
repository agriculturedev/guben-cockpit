import {useState} from "react";
import {Option} from "@/types/common.types";

export type SortingDirection = "Ascending" | "Descending";
type TField = Option<string>;

export type UseSortingFilterHook = ReturnType<typeof useSortingFilter>;

export const useSortingFilter = (
  defaultDirection: SortingDirection = "Ascending"
) => {
  const [field, setField] = useState<TField>(null);
  const [direction, setDirection] = useState<SortingDirection>(defaultDirection);

  function setFilter(field: TField, direction?: SortingDirection): void {
    setField(field);
    setDirection(direction ?? defaultDirection);
  }

  function clearFilter() {
    setField(null);
    setDirection(defaultDirection);
  }

  return {
    filter: {field, direction},
    setFilter,
    clearFilter
  };
}
