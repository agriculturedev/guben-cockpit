import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FloatInput, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { WithClassName } from "@/types/WithClassName";
import { cn } from "@/lib/utils";
import { DialogFooter } from "@/components/ui/dialog";
import { EventFormDefaults, EventFormSchema, EventFormZodObject } from "@/components/admin/events/eventDialog.formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useCategoriesGetAll, useLocationsGetAll } from "@/endpoints/gubenComponents";
import { Combobox } from "@/components/ui/comboBox";
import { ComboboxOption, MultiComboBox } from "@/components/inputs/MultiComboBox";

interface EventFormProps extends WithClassName {
  defaultData?: EventFormSchema;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

export const EventForm = ({ defaultData, onSubmit, onClose, className }: EventFormProps) => {
  const { t } = useTranslation(["common"]);
  const {data: categoriesResponse, isPending: categoriesLoading} = useCategoriesGetAll({});
  const {data: locationsResponse, isPending: locationsLoading} = useLocationsGetAll({});

  const locationOptions: ComboboxOption[] = [];
  if(locationsResponse?.locations) {
    const added: Record<string, boolean> = {};

    for(let i = 0; i < locationsResponse.locations.length; i++) {
      const location = locationsResponse.locations[i];

      if(location.city && !added[location.city]) {
        locationOptions.push({
          value: location.id,
          label: `${location.name} - ${location.city}`,
          hasPriority: false
        });
        added[`${location.name} - ${location.city}`] = true;
      }
    }
  }

  const categoryOptions: ComboboxOption[] = [];
  if(categoriesResponse?.categories) {
    const added: Record<string, boolean> = {};

    for(let i = 0; i < categoriesResponse.categories.length; i++) {
      const category = categoriesResponse.categories[i];

      if(category.name && !added[category.name]) {
        categoryOptions.push({
          value: category.id,
          label: category.name,
          hasPriority: false
        });
        added[category.name] = true;
      }
    }
  }

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(EventFormZodObject),
    defaultValues: EventFormDefaults
  })

  //ensure form is reset on mount
  useEffect(() => form.reset(defaultData ?? EventFormDefaults), [defaultData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2", className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Title")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Title")} {...field} />
              </FormControl>
              <FormMessage />
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
                <Input placeholder={t("Description")} {...field} />
              </FormControl>
              <FormMessage />
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
                <Input type="datetime-local" {...field} value={field.value ?? undefined} />
              </FormControl>
              <FormMessage />
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
                <Input type="datetime-local" {...field} value={field.value ?? undefined}/>
              </FormControl>
              <FormMessage />
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
                <FloatInput {...field} value={field.value ?? undefined}/>
              </FormControl>
              <FormMessage />
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
                <FloatInput {...field} value={field.value ?? undefined}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel>{t("Location")}</FormLabel>
              <FormControl>
                <Combobox
                  isLoading={locationsLoading}
                  options={locationOptions}
                  placeholder={t("Location")}
                  value={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem className={"flex flex-col gap-1"}>
              <FormLabel>{t("Categories")}</FormLabel>
              <FormControl>
                <MultiComboBox
                  isLoading={categoriesLoading}
                  options={categoryOptions}
                  placeholder={t("Location")}
                  defaultValues={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField // TODO@JOREN: this ain't exactly pretty, kilian? got any ideas?
          control={form.control}
          name="urls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Urls")}</FormLabel>
              <FormControl>
                <EditableUrlList values={field.value || []} onChange={field.onChange} placeholder={t("Urls")} />
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


interface EditableUrlListProps {
  values: { title: string; url: string }[];
  onChange: (urls: { title: string; url: string }[]) => void;
  placeholder?: string;
}

export const EditableUrlList = ({ values, onChange, placeholder }: EditableUrlListProps) => {
  const { t } = useTranslation();
  const [urls, setUrls] = useState(values);

  const addUrl = () => {
    setUrls([...urls, { title: "", url: "" }]);
  };

  const updateUrl = (index: number, field: keyof (typeof urls)[number], value: string) => {
    const updatedUrls = urls.map((url, i) => (i === index ? { ...url, [field]: value } : url));
    setUrls(updatedUrls);
    onChange(updatedUrls);
  };

  const removeUrl = (index: number) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls);
    onChange(updatedUrls);
  };

  return (
    <div className="flex flex-col gap-2">
      {urls.map((url, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder={t("Title")}
            value={url.title}
            onChange={(e) => updateUrl(index, "title", e.target.value)}
          />
          <Input
            type="url"
            placeholder={placeholder ?? t("Url")}
            value={url.url}
            onChange={(e) => updateUrl(index, "url", e.target.value)}
          />
          <Button type="button" variant="destructive" onClick={() => removeUrl(index)}>
            {t("Delete")}
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addUrl}>
        {t("Add")}
      </Button>
      <FormMessage />
    </div>
  );
};
