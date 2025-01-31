import {MultiComboBox, ComboboxOption} from "@/components/inputs/MultiComboBox";
import {useLocationsGetAll} from "@/endpoints/gubenComponents";
import {UseMultiComboFilterHook} from "@/hooks/filters/useMultiComboFilter";

type MultiComboFilterProps = {
  controller: UseMultiComboFilterHook;
  placeHolder: string;
}

export function LocationFilter(props: MultiComboFilterProps) {
  const {data} = useLocationsGetAll({});

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
    <MultiComboBox
      defaultValues={props.controller.filters}
      options={options}
      placeholder={props.placeHolder}
      onSelect={props.controller.setFilter}
    />
  )
}
