import { useTranslation } from "react-i18next";
import { formDefaults, formSchema, FormSchema } from "./editBookingItemDialog.formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface IProps {
  defaultData?: FormSchema;
  onSubmit: (form: FormSchema) => void;
  onClose: () => void;
}

export default function EditBookingItemDialogForm(props: IProps) {
  const { t } = useTranslation(["booking", "common"]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaults
  });

  useEffect(() => form.reset(props.defaultData ?? formDefaults), [props.defaultData]);

  return (
    <Form {...form}>
      <form className={"flex flex-col gap-4"} onSubmit={form.handleSubmit(props.onSubmit)}>
        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('tenantId')}</FormLabel>
              <FormControl>
                <Input placeholder={t('tenantId')} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="forPublicUse"
          render={({ field }) => (
            <FormItem className="flex gap-2 items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>{t("ForPublicUse")}</FormLabel>
            </FormItem>
          )}
        />
        
        <div className={"flex justify-end gap-2"}>
          <Button className={"bg-transparent text-foreground"} onClick={props.onClose}>{t("common:Cancel")}</Button>
          <Button className={"bg-gubenAccent text-gubenAccent-foreground"}>{t("common:Save")}</Button>
        </div>
      </form>
    </Form>
  )
}