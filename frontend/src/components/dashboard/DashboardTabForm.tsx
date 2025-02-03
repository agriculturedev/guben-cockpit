import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WithClassName } from "@/types/WithClassName";
import { useTranslation } from "react-i18next";
import { DashboardTabFormType } from "./useDashboardTabFormSchema";

type OnSubmitFnArgs = { title: string, mapUrl: string }

interface DashboardFormProps extends WithClassName {
  form: DashboardTabFormType;
  onSubmit: (values: OnSubmitFnArgs) => void;
}

export const DashboardTabForm = ({ form, onSubmit, className }: DashboardFormProps) => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex gap-4 w-1/2'>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("common:Title")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("common:Title")}
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mapUrl"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("dashboard:MapUrl")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("dashboard:MapUrl")}
                    {...field}
                    value={field.value ?? undefined}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isDirty}
          className='w-32 bg-gubenAccent hover:bg-red-400'
        >
          {t("common:Save")}
        </Button>
      </form>
    </Form>
  )
}
