import { z } from "zod";
import {
  formDefaults as baseFormDefaults,
  formSchema as baseFormSchema
} from "./bookingItemDialog.formSchema";

export const formSchema = baseFormSchema;

export type FormSchema = z.infer<typeof formSchema>;

export const formDefaults: FormSchema = {
  ...baseFormDefaults,
}