import { z } from "zod";

const urlSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

export const EventFormZodObject = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  urls: z.array(urlSchema),
  categoryIds: z.array(z.string()),
  locationId: z.string().uuid().optional(),
});

export type EventFormSchema = z.infer<typeof EventFormZodObject>;

export const EventFormDefaults: EventFormSchema = {
  title: "",
  description: "",
  startDate: undefined,
  endDate: undefined,
  latitude: undefined,
  longitude: undefined,
  urls: [],
  categoryIds: [],
  locationId: undefined,
}
