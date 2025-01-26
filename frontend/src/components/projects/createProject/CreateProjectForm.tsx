import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { projectFormType } from "./useCreateProjectFormSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ProjectFormProps {
  form: projectFormType;
  onSubmit: (values: {
    title: string;
    description: string | null;
    fullText: string | null;
    imageCaption: string | null;
    imageUrl: string | null;
    imageCredits: string | null;
  }) => void;
}

export const ProjectForm = ({form, onSubmit}: ProjectFormProps) => {
  const {t} = useTranslation();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("Title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Title")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Description")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullText"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("FullText")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("FullText")}
                  className="resize-none"
                  {...field}
                  value={field.value ?? undefined}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageCaption"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("ImageCaption")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ImageCaption")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("ImageUrl")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ImageUrl")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageCredits"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("ImageCredits")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ImageCredits")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={!form.formState.isDirty}>{t("Save")}</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
