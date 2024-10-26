export function isNullOrUndefinedOrWhiteSpace(value: string | String | undefined | null) {
  return isNullOrUndefined(value) || value === "" || value!.match(/^\s*$/) !== null;
}

export function isNullOrUndefined(value: any | undefined | null) {
  return value === null || value === undefined;
}