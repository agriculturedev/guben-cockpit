import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { pageFormType } from "@/components/admin/pages/usePageFormSchema";
import { Textarea } from "@/components/ui/textarea";

interface PageFormProps {
  form: pageFormType;
  onSubmit: (values: {
    title: string;
    description: string;
  }) => void;
}

export const PageForm = ({form, onSubmit}: PageFormProps) => {
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
                <Textarea placeholder={t("Description")} {...field} value={field.value ?? undefined} />
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
