import {MultiComboBox, ComboboxOption} from "@/components/inputs/MultiComboBox";
import {useLocationsGetAll} from "@/endpoints/gubenComponents";
import {UseMultiComboFilterHook} from "@/hooks/filters/useMultiComboFilter";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

type MultiComboFilterProps = {
  controller: UseMultiComboFilterHook;
  className?: string;
}

export function LocationFilter(props: MultiComboFilterProps) {
  const {data} = useLocationsGetAll({});
  const {t} = useTranslation();

  const options: ComboboxOption[] = [];
  if(data?.locations) {
    const added: Record<string, boolean> = {};
    for(let i = 0; i < data.locations.length; i++) {
      const location = data.locations[i];
       if(location.city && !added[location.city]) {
         options.push({
           value: location.city,
           label: location.city,
           hasPriority: false
         });
         added[location.city] = true;
       }
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", props.className ?? "")}>
      <Label>{t("Location")}</Label>
      <MultiComboBox
        defaultValues={props.controller.filters}
        options={options}
        placeholder={t("Location")}
        onSelect={props.controller.setFilter}
      />
    </div>
  )
}
