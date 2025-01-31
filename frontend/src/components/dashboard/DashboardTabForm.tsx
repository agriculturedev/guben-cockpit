import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { DashboardTabFormType } from "./useDashboardTabFormSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";

interface DashboardFormProps extends WithClassName {
  form: DashboardTabFormType;
  onSubmit: (values: {
    title: string;
    mapUrl: string;
  }) => void;
}

export const DashboardTabForm = ({form, onSubmit, className}: DashboardFormProps) => {
  const {t} = useTranslation(["dashboard", "common"]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2", className)}>
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("Title", {ns: "common"})}</FormLabel>
              <FormControl>
                <Input placeholder={t("Title", {ns: "common"})} {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mapUrl"
          render={({field}) => (
            <FormItem>
              <FormLabel>{t("MapUrl", {ns: "dashboard"})}</FormLabel>
              <FormControl>
                <Input placeholder={t("MapUrl", {ns: "dashboard"})} {...field} value={field.value ?? undefined} />
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
