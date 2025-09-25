import { z } from "zod";

export const formSchema = z.object({
	tenantId: z.string(),
	forPublicUse: z.boolean(),
});

export type FormSchema = z.infer<typeof formSchema>;

export const formDefaults: FormSchema = {
	tenantId: "",
	forPublicUse: false
}