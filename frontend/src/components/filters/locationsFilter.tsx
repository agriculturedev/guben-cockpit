import { ComboboxOption, MultiComboBox } from "@/components/inputs/MultiComboBox";
import { Label } from "@/components/ui/label";
import { useLocationsGetAll } from "@/endpoints/gubenComponents";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type LocationsFilterProps = {
  className?: string;
  onChange: (values: string[]) => unknown;
  value: string[];
}

export function LocationsFilter({
  className,
  onChange,
  value
}: LocationsFilterProps
) {
  const { data } = useLocationsGetAll({});
  const { t } = useTranslation();

  const options: ComboboxOption[] = useMemo(() => {
    if(!data?.locations) return [];
    const red = data.locations.reduce((acc: Record<string, ComboboxOption>, loc) => {
      if(loc.city == null) return acc;
      if(acc[loc.city] == undefined) acc[loc.city] = {
        value: loc.city,
        label: loc.city,
        hasPriority: false
      };
      return acc;
    }, {});
    return Object.values(red);
  }, [data?.locations]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Location")}</Label>
      <MultiComboBox
        options={options}
        placeholder={t("Location")}
        defaultValues={value}
        onSelect={onChange}
      />
    </div>
  )
}
