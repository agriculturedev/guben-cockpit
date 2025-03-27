import { z } from "zod";
import {
  formDefaults as baseFormDefaults,
  formSchema as baseFormSchema
} from "./projectDialog.formSchema";

export const formSchema = baseFormSchema.extend({
  isBusiness: z.boolean().default(false)
});

export type FormSchema = z.infer<typeof formSchema>;

export const formDefaults: FormSchema = {
  ...baseFormDefaults,
  isBusiness: false
}
