export const isNullOrUndefinedOrEmpty = (value: any[] | undefined | null) => {
  return value === null || value === undefined || value.length === 0;
}