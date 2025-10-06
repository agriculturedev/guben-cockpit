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
import { useTranslation } from "react-i18next";
import { DropdownFormType } from "./useDropdownFormSchema";

type OnSubmitFnArgs = { title: string; };

interface DropdownFormProps extends WithClassName {
  form: DropdownFormType;
  onSubmit: (values: OnSubmitFnArgs) => void;
}

export const DropdownForm = ({
  form,
  onSubmit,
  className,
}: DropdownFormProps) => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4 min-w-[20rem] w-fit">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("common:Title")}</FormLabel>
                <FormControl>
                  <Input
                    className={"min-w-[10rem]"}
                    placeholder={t("common:Title")}
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