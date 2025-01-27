import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useCreateProjectFormSchema = () => {
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
      title: "",
      description:  null,
      fullText:  null,
      imageCaption:  null,
      imageUrl:  null,
      imageCredits:  null,
    },
  })

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
