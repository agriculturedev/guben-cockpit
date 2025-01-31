import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { DashboardCardFormType } from "./useDashboardCardFormSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { Switch } from "@/components/ui/switch";

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
              <FormLabel>{t("Cards.ImageUrl", {ns: "dashboard"})}</FormLabel>
              <FormControl>
                <Input placeholder={t("Cards.ImageUrl", {ns: "dashboard"})} {...field} value={field.value ?? undefined} />
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

const CardButtonForm = ({form}: {form: DashboardCardFormType}) => {
  return (
    <div className={"flex flex-col gap-2"}>

      <FormField
        control={form.control}
        name="button.title"
        render={({field}) => (
          <FormItem>
            <FormLabel>{t("Cards.Button.Title", {ns: "dashboard"})}</FormLabel>
            <FormControl>
              <Input placeholder={t("Cards.Description", {ns: "dashboard"})} {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="button.url"
        render={({field}) => (
          <FormItem>
            <FormLabel>{t("Cards.Button.Url", {ns: "dashboard"})}</FormLabel>
            <FormControl>
              <Input placeholder={t("Cards.Description", {ns: "dashboard"})} {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="button.openInNewTab"
        render={({field}) => (
          <FormItem className={"flex flex-col gap-2"}>
            <FormLabel>{t("Cards.Button.OpenInNewTab", {ns: "dashboard"})}</FormLabel>
            <FormControl>
              <Switch onCheckedChange={field.onChange} checked={field.value} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </div>
  )
}
