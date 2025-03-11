import { z } from "zod";

const urlSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

export const LocationFormZodObject = z.object({
  name: z.string(),
  city: z.string().optional(),
  zip: z.string().optional(),
  street: z.string().optional(),
  telephoneNumber: z.string().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
});

export type LocationFormSchema = z.infer<typeof LocationFormZodObject>;

export const LocationFormDefaults: LocationFormSchema = {
  name: "",
  city: undefined,
  zip: undefined,
  street: undefined,
  telephoneNumber: undefined,
  email: undefined,
  fax: undefined
}
