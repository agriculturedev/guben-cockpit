import { z } from "zod";
import { DashboardDropdownResponse } from "@/endpoints/gubenSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

export const useDropdownFromSchema = (dropdown?: DashboardDropdownResponse) => {
    const formSchema = z.object({
        title: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: dropdown?.title ?? "",
        },
    });

    useEffect(() => {
        form.reset({
            title: dropdown?.title ?? "",
        });
    }, [dropdown]);

    return {
        formSchema,
        form
    }
}

export type DropdownFormType = UseFormReturn<{
    title: string;
}>