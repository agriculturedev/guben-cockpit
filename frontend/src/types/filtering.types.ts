export type UseFilterHook<T> = () => {
  filter: T,
  setFilter: (value: T) => void;
  clearFilter: () => void;
};
