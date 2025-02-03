import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { DashboardCardFormType } from "./useDashboardCardFormSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {  isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import { EditableImage } from "@/components/ui/editableImage";

interface DashboardCardFormProps extends WithClassName {
  form: DashboardCardFormType;
  onSubmit: (values: {
    title: string | null;
    description: string | null;
    button: {
      title: string,
      url: string,
      openInNewTab: boolean
    } | null;
    imageUrl: string | null;
    imageAlt: string | null;
  }) => void;
}

export const DashboardCardForm = ({form, onSubmit, className}: DashboardCardFormProps) => {
  const {t} = useTranslation(["dashboard"]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2", className)}>
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("Cards.Title", {ns: "dashboard"})}</FormLabel>
              <FormControl>
                <Input placeholder={t("Cards.Title", {ns: "dashboard"})} {...field} value={field.value ?? undefined} />
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
              <FormLabel>{t("Cards.Description", {ns: "dashboard"})}</FormLabel>
              <FormControl>
                <Input placeholder={t("Cards.Description", {ns: "dashboard"})} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <CardButtonForm form={form}/>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("Cards.Image", {ns: "dashboard"})}</FormLabel>
              <FormControl>
                {
                  field.value != null
                    ? <EditableImage imageUrl={field.value} onChange={field.onChange}/>
                    : <Input placeholder={t("Cards.ImageUrl", {ns: "dashboard"})} {...field} value={undefined} /> // TODO@JOREN: when starting to type it switches, add bool to editable tab 'StartInEditingState'
                }

              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageAlt"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("Cards.ImageAlt", {ns: "dashboard"})}</FormLabel>
              <FormDescription>{t("Cards.ImageAltExplanation", {ns: "dashboard"})}</FormDescription>
              <FormControl>
                <Input placeholder={t("Cards.ImageAlt", {ns: "dashboard"})} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={!form.formState.isDirty}>{t("Save", {ns: "common"})}</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}


const CardButtonForm = ({ form }: { form: DashboardCardFormType }) => {
  const { t } = useTranslation("dashboard");
  const [addButton, setAddButton] = useState(!isNullOrUndefinedOrWhiteSpace(form.getValues("button")?.title)); // Initialize based on form value

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={addButton}
          onCheckedChange={(checked) => {
            setAddButton(checked);
            if (checked) {
              form.setValue("button", {
                title: "",
                url: "",
                openInNewTab: false, // Set default to false when enabling
              });
            } else {
              form.setValue("button", null);
            }
          }}
        />
        <span>{t("Cards.Button.Add", { ns: "dashboard" })}</span>
      </div>

      {addButton && (
        <>
          <FormField
            control={form.control}
            name="button.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Cards.Button.Title", { ns: "dashboard" })}</FormLabel>
                <FormControl>
                  <Input placeholder={t("Cards.Button.Title", { ns: "dashboard" })} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="button.url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Cards.Button.Url", { ns: "dashboard" })}</FormLabel>
                <FormControl>
                  <Input placeholder={t("Cards.Button.Url", { ns: "dashboard" })} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="button.openInNewTab"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>{t("Cards.Button.OpenInNewTab", { ns: "dashboard" })}</FormLabel>
                <FormControl>
                  <Switch onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};
