import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { WithClassName } from "@/types/WithClassName";
import { DropdownLinkFormType } from "./useDropdownLinkFormSchema";

type OnSubmitFnArgs = { title: string; link: string };

interface DropdownLinkFormProps extends WithClassName {
  form: DropdownLinkFormType;
  onSubmit: (values: OnSubmitFnArgs) => void;
}

export const DropdownLinkForm = ({
  form,
  onSubmit,
  className,
}: DropdownLinkFormProps) => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex gap-4 min-w-[30rem] w-fit">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("common:Title")}</FormLabel>
                <FormControl>
                  <Input
                    className="min-w-[10rem]"
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
            name="link"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("dashboard:LinkUrl")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("dashboard:LinkUrl")}
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
          className="w-32 bg-gubenAccent hover:bg-red-400"
        >
          {t("common:Save")}
        </Button>
      </form>
    </Form>
  );
};
