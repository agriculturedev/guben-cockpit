import {HashMap, Option} from "@/types/common.types";

export function getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
}

export function tryGetEnumValue<T extends HashMap<unknown>>(value: Option<string>, enumObject: T, defaultValue?: Option<string>): T[keyof T] {
  if (value !== null) { // if a value has been passed, check whether it is a valid enum value as either string or number
    if (isNaN(+value)) {
      if (Object.values(enumObject).includes(value)) {
        return value as T[keyof T]
      }
    } else if (parseInt(value, 10) in enumObject) {
      return parseInt(value, 10) as T[keyof T]
    }
  }

  if (defaultValue !== undefined) {
    return defaultValue as T[keyof T]
  }

  // when no value has been passed, check if there are any numeric values in the enum, if so use the first one
  const numericEnumValues = Object.values(enumObject).filter((x: any) => !isNaN(+x));
  if (numericEnumValues.length > 0) {
    return numericEnumValues[0] as T[keyof T];
  }

  // when no value has been passed and no numeric values are present, use the first string value
  const first = enumObject[Object.keys(enumObject)[0]];
  if (first !== null && first !== undefined) {
    if (isNaN(+first)){
      if (Object.values(enumObject).includes(first)) {
        return first as T[keyof T]
      }
    }
  }

  //if no valid value found return the first item of the enum
  return 0 as T[keyof T];
}