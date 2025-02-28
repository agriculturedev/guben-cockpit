import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { useEffect } from "react";

export const useProjectFormSchema = (project?: ProjectResponse) => {
  const formSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    fullText: z.string().nullable(),
    imageCaption: z.string().nullable(),
    imageUrl: z.string().nullable(),
    imageCredits: z.string().nullable(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? null,
      fullText: project?.fullText ?? null,
      imageCaption:  project?.imageCaption ?? null,
      imageUrl: project?.imageUrl ?? null,
      imageCredits: project?.imageCredits ?? null,
    },
  })

  useEffect(() => { // this useEffect is important to live update the form fields' dirty state after submit
    form.reset({
      title: project?.title ?? "",
      description: project?.description ?? null,
      fullText: project?.fullText ?? null,
      imageCaption:  project?.imageCaption ?? null,
      imageUrl: project?.imageUrl ?? null,
      imageCredits: project?.imageCredits ?? null,
    });
  }, [project]);

  return {
    formSchema,
    form
  }
}

export type projectFormType = UseFormReturn<{
  title: string;
  description: string | null;
  fullText: string | null;
  imageCaption: string | null;
  imageUrl: string | null;
  imageCredits: string | null;
}, any, undefined>
