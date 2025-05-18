import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  content: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const formDefaults: FormSchema = {
  name: "",
  content: "",
}
