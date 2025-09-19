import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownLinkResponse } from "@/endpoints/gubenSchemas";
import { useEffect } from "react";

export const useDropdownLinkFormSchema = (link?: DropdownLinkResponse) => {
  const formSchema = z.object({
    title: z.string(),
    link: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: link?.title ?? "",
      link: link?.link ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      title: link?.title ?? "",
      link: link?.link ?? "",
    });
  }, [link]);

  return {
    formSchema,
    form,
  };
};

export type DropdownLinkFormType = UseFormReturn<
  {
    title: string;
    link: string;
  },
  any,
  undefined
>;
