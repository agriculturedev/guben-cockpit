import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { EventFormSchema, eventFormSchema, formDefaults } from "./editEventDialog.formSchema";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Combobox } from "@/components/ui/comboBox";
import { Button } from "@/components/ui/button";

import HtmlEditor from "@/components/htmlEditor/editor";
import MultiComboBox from "@/components/inputs/MultiComboBox";

interface IProps {
  defaultData?: EventFormSchema;
  onSubmit: (form: EventFormSchema) => void;
  onClose: () => void;
  categoryOptions: { label: string; value: string }[];
  locationsOptions: { label: string; value: string }[];
}

export default function EditEventDialogForm(props: IProps) {
  const { t } = useTranslation("events");

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: formDefaults
  });

  useEffect(() => {
    form.reset(props.defaultData ?? formDefaults);
  }, [props.defaultData]);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(props.onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Title")} {...field} />
              </FormControl>
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
                <HtmlEditor content={field.value ?? ""} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("StartDate")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("EndDate")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Latitude")}</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Longitude")}</FormLabel>
              <FormControl>
                <Input type="number" step="any" {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Category")}</FormLabel>
              <FormControl>
                <MultiComboBox
                  options={props.categoryOptions}
                  defaultValues={field.value ?? []}
                  onSelect={field.onChange}
                  placeholder={t("Category")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Location")}</FormLabel>
              <FormControl>
                <Combobox
                  options={props.locationsOptions}
                  value={field.value ?? ""}
                  onSelect={field.onChange}
                  placeholder={t("Location")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className={"flex justify-end gap-2"}>
          <Button className={"bg-transparent text-foreground"} onClick={props.onClose}>{t("Cancel")}</Button>
          <Button className={"bg-gubenAccent text-gubenAccent-foreground"}>{t("Save")}</Button>
        </div>
      </form>
    </Form>
  );
}
