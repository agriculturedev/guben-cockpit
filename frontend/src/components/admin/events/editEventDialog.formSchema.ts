import { EventFormZodObject as baseFormSchema, EventFormDefaults as baseFormDefaults } from "./eventDialog.formSchema";
import { z } from "zod";

export const eventFormSchema = baseFormSchema;

export type EventFormSchema = z.infer<typeof eventFormSchema>;

export const formDefaults: EventFormSchema = {
    ...baseFormDefaults,
}