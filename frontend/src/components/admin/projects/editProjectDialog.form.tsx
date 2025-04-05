import { Button } from "@/components/ui/button";
import { EditableImage } from "@/components/ui/editableImage";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEventHandler, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formSchema, formDefaults, FormSchema } from "./editProjectDialog.formSchema";
import { Checkbox } from "@/components/ui/checkbox";

interface IProps {
  defaultData?: FormSchema;
  onSubmit: (form: FormSchema) => void;
  onClose: () => void;
}

export default function EditProjectDialogForm(props: IProps) {
  const { t } = useTranslation(["common", "projects"]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaults
  })

  //ensure form is reset on mount
  useEffect(() => form.reset(props.defaultData ?? formDefaults), [props.defaultData]);

  return (
    <Form {...form}>
      <form className={"flex flex-col gap-4"} onSubmit={form.handleSubmit(props.onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Title")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("Description")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ImageUrl")}</FormLabel>
              <FormControl>
                <EditableImage
                  imageUrl={field.value ?? undefined}
                  onChange={field.onChange}
                  startInEditingState
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageCredits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ImageCredits")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ImageCredits")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageCaption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ImageCaption")}</FormLabel>
              <FormControl>
                <Input placeholder={t("ImageCaption")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("FullText")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("FullText")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isBusiness"
          render={({ field }) => {
            return (
              <FormItem className="flex gap-2 items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>{t("projects:IsBusiness")}</FormLabel>
              </FormItem>
            )
          }
        }/>

        <div className={"flex justify-end gap-2"}>
          <Button className={"bg-transparent text-foreground"} onClick={props.onClose}>{t("Cancel")}</Button>
          <Button className={"bg-gubenAccent text-gubenAccent-foreground"}>{t("Save")}</Button>
        </div>
      </form>
    </Form>
  )
}
