export type QueryFilter = [string, string];
export type SetFiltersCallback = (value: QueryFilter[]) => void;
export type ClearFilterCallback = () => void;

export interface FilterController {
  clearFilter: ClearFilterCallback;
}

/**
 *
 * @param {string} filters all filters currently set.
 * @param {SetFiltersCallback} setFilters callback function used for updating the filters.
 * @returns FilterController
 */
export type UseFilterHook<T extends FilterController> = (
  filters: QueryFilter[],
  setFilters: SetFiltersCallback,
  queryDefinition: string
) => T;
