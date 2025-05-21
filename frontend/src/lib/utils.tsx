import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getParamsFromURI = ( uri: string ) => {
  // Get everything after the `?`
  const [ , paramString ] = uri.split( '?' );

  // Return parameters
  return new URLSearchParams( paramString );
};
