import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardTabResponse } from "@/endpoints/gubenSchemas";
import { useEffect } from "react";

export const useDashboardTabFormSchema = (tab?: DashboardTabResponse) => {
  const formSchema = z.object({
    title: z.string(),
    mapUrl: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: tab?.title ?? "",
      mapUrl: tab?.mapUrl ?? "",
    },
  })

  useEffect(() => { // this useEffect is important to live update the form fields' dirty state after submit
    form.reset({
      title: tab?.title ?? "",
      mapUrl: tab?.mapUrl ?? "",
    });
  }, [tab]);

  return {
    formSchema,
    form
  }
}

export type DashboardTabFormType = UseFormReturn<{
  title: string;
  mapUrl: string;
}, any, undefined>
