import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { LocationFormDefaults, LocationFormSchema, LocationFormZodObject } from "@/components/admin/locations/locationDialog.formSchema";

interface LocationFormProps extends WithClassName {
  defaultData?: LocationFormSchema;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

export const LocationForm = ({ defaultData, onSubmit, onClose, className }: LocationFormProps) => {
  const { t } = useTranslation(["common", "locations"]);

  const form = useForm<LocationFormSchema>({
    resolver: zodResolver(LocationFormZodObject),
    defaultValues: LocationFormDefaults
  })

  //ensure form is reset on mount
  useEffect(() => form.reset(defaultData ?? LocationFormDefaults), [defaultData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("locations:City")}</FormLabel>
              <FormControl>
                <Input placeholder={t("locations:City")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("locations:Zip")}</FormLabel>
              <FormControl>
                <Input placeholder={t("locations:Zip")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("locations:Street")}</FormLabel>
              <FormControl>
                <Input placeholder={t("locations:Street")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("locations:TelephoneNumber")}</FormLabel>
              <FormControl>
                <Input placeholder={t("locations:TelephoneNumber")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("locations:Email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("locations:Email")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("locations:Fax")}</FormLabel>
              <FormControl>
                <Input placeholder={t("locations:Fax")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button className={"bg-transparent text-foreground"} onClick={onClose}>{t("Cancel")}</Button>
          <Button type="submit" className={"bg-gubenAccent text-gubenAccent-foreground"} disabled={!form.formState.isDirty}>{t("Save")}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

