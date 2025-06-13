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
  customLocations?: { city: string | null | undefined }[];
}

export function LocationsFilter({
  className,
  onChange,
  value,
  customLocations = []
}: LocationsFilterProps
) {
  const { data } = useLocationsGetAll({});
  const { t } = useTranslation();

  const options: ComboboxOption[] = useMemo(() => {
    const backendCities = (data?.locations ?? [])
      .map(loc => loc.city)
      .filter((city): city is string => !!city);

    const customCities = customLocations
      .map(loc => loc.city)
      .filter((city): city is string => !!city);

    const allCities = Array.from(new Set([...backendCities, ...customCities]));

    return allCities.map(city => ({
      value: city,
      label: city,
      hasPriority: false
    }));
  }, [data?.locations, customLocations]);

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
  );
}
