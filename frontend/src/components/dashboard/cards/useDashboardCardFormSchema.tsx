import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InformationCardResponse } from "@/endpoints/gubenSchemas";
import { useEffect } from "react";

export const useDashboardCardFormSchema = (card?: InformationCardResponse) => {
  const buttonFormSchema = z.object({
    title: z.string(),
    url: z.string(),
    openInNewTab: z.boolean().default(false),
  })

  const formSchema = z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    button: buttonFormSchema.nullable(),
    imageUrl: z.string().nullable(),
    imageAlt: z.string().nullable(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: card?.title ?? null,
      description: card?.description ?? null,
      button: card?.button ?? {
        title: "",
        url: "",
        openInNewTab: false,
      },
      imageUrl: card?.imageUrl ?? null,
      imageAlt: card?.imageAlt ?? null,
    },
  })

  useEffect(() => { // this useEffect is important to live update the form fields' dirty state after submit
    form.reset({
      title: card?.title ?? null,
      description: card?.description ?? null,
      button: card?.button ?? {
        title: "",
        url: "",
        openInNewTab: false,
      },
      imageUrl: card?.imageUrl ?? null,
      imageAlt: card?.imageAlt ?? null,
    });
  }, [card]);

  return {
    formSchema,
    form
  }
}

export type DashboardCardFormType = UseFormReturn<{
  title: string | null;
  description: string | null;
  button: {
    title: string,
    url: string,
    openInNewTab: boolean
  } | null;
  imageUrl: string | null;
  imageAlt: string | null;
}, any, undefined>
