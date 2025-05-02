import { z } from "zod";

export const formSchema = z.object({
  locations: z.array(z.string()),
  category: z.string().nullable(),
  title: z.string().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable()
});

export type FormSchema = z.infer<typeof formSchema>;
