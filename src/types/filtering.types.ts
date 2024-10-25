export type QueryFilter = [string, string];
type SetFiltersCallback = (value: QueryFilter[]) => void;

export interface FilterController {
  clearFilter: () => void;
}

/**
 *
 * @param {string} filters all filters currently set.
 * @param {SetFiltersCallback} setFilters callback function used for updating the filters.
 * @returns FilterController
 */
export type UseFilterHook<T extends FilterController> = (
  filters: QueryFilter[],
  setFilters: SetFiltersCallback
) => T;