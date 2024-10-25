export type QueryFilter = [string, string];

export interface FilterController {
  clearFilter: () => void;
}

/**
 *
 * @param {string} paramName the name of the search parameter that will be used to filter the data.
 *      This value will be appended to the query url.
 * @returns TextFilterControlller
 */
export type UseFilterHook<T> = (
  filters: QueryFilter[],
  setFilters: (value: QueryFilter[]) => void
) => T;