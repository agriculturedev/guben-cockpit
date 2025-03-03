import { z } from "zod";

export const formSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  fullText: z.string().nullable(),
  imageCaption: z.string().nullable(),
  imageUrl: z.string().nullable(),
  imageCredits: z.string().nullable(),
  highlighted: z.boolean().default(false)
});

export type FormSchema = z.infer<typeof formSchema>;

export const formDefaults: FormSchema = {
  title: "",
  description: null,
  fullText: null,
  imageCaption: null,
  imageUrl: null,
  imageCredits: null,
  highlighted: false,
}
