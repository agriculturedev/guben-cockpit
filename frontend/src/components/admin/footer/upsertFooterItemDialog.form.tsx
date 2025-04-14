import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {formDefaults, formSchema, FormSchema } from "./footerItemDialog.formSchema";
import HtmlEditor from "@/components/htmlEditor/editor";

interface IProps {
  defaultData?: FormSchema;
  onSubmit: (form: FormSchema) => void;
  onClose: () => void;
}

export default function UpsertFooterItemDialogForm(props: IProps) {
  const { t } = useTranslation(["common", "footer"]);

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Name")} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("footer:Content")}</FormLabel>
              <FormControl>
                <HtmlEditor {...field} content={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={"flex justify-end gap-2"}>
          <Button className={"bg-transparent text-foreground"} onClick={props.onClose}>{t("Cancel")}</Button>
          <Button className={"bg-gubenAccent text-gubenAccent-foreground"}>{t("Save")}</Button>
        </div>
      </form>
    </Form>
  )
}
