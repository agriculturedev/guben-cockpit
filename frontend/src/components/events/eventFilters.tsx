import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LocationsFilter } from "../filters/locationsFilter";
import { Input } from "../ui/input";
import { formSchema, FormSchema } from "./eventFilters.formSchema";
import { CategoryFilter } from "../filters/CategoryFilter";

export default function EventFilters() {
  const { t } = useTranslation("common");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locations: [],
      category: null,
      title: null,
      startDate: null,
      endDate: null
    }
  });

  return (
    <div className="space-y-4">
      <Input
        {...form.register("title")}
        placeholder={t("Search")}
      />

      <div className="flex gap-4 flex-nowrap">
        <Controller
          control={form.control}
          name="locations"
          render={({ field: {ref, ...fields} }) => <LocationsFilter {...fields} />}
        />

        <Controller
          control={form.control}
          name="category"
          render={({field: {ref, ...fields}}) => <CategoryFilter {...fields} />}
        />
      </div>
    </div>
  );
}
