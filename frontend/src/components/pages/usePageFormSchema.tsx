import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageResponse } from "@/endpoints/gubenSchemas";
import { useEffect } from "react";

export const usePageFormSchema = (page?: PageResponse) => {
  const formSchema = z.object({
    title: z.string(),
    description: z.string(),

  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title ?? "",
      description: page?.description ?? "",
    },
  })

  useEffect(() => { // this useEffect is important to live update the form fields' dirty state after submit
    form.reset({
      title: page?.title ?? "",
      description: page?.description ?? "",
    });
  }, [page]);

  return {
    formSchema,
    form
  }
}

export type pageFormType = UseFormReturn<{
  title: string;
  description: string;
}, any, undefined>
