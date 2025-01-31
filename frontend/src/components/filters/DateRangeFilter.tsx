import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker"
import { useCallback, useMemo } from "react";
import {DateFilterPreset, UseDateRangeFilterHook} from "@/hooks/filters/useDateRangeFilter";
import DateRangePicker from "../inputs/DateRangePicker";

interface Props {
  controller: UseDateRangeFilterHook;
}

export const DateRangeFilter = ({controller}: Props) => {
  const onChange = useCallback((newRange?: DateRange ) => {
    controller.setFilter({
      startDate: newRange?.from ?? null,
      endDate: newRange?.to ?? null
    });
  }, [controller]);

  return (
    <>
      <Select
        value={controller.preset ?? "none"}
        onValueChange={preset => controller.setFilter(preset as DateFilterPreset)}
      >
        <SelectTrigger className={"w-[180px]"}>
          <SelectValue placeholder="Datum"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"none"}>(Datum)</SelectItem>
          <SelectItem value={DateFilterPreset.TODAY}>{"heute"}</SelectItem>
          <SelectItem value={DateFilterPreset.TOMORROW}>{"morgen"}</SelectItem>
          <SelectItem value={DateFilterPreset.THIS_WEEK}>{"diese woche"}</SelectItem>
          <SelectItem value={DateFilterPreset.NEXT_WEEK}>{"nächste woche"}</SelectItem>
          <SelectItem value={DateFilterPreset.THIS_MONTH}>{"diesen monat"}</SelectItem>
          <SelectItem value={DateFilterPreset.NEXT_MONTH}>{"nächsten monat"}</SelectItem>
          <SelectItem value={DateFilterPreset.THIS_YEAR}>{"dieses jahr"}</SelectItem>
          <SelectItem value={DateFilterPreset.CUSTOM}>{"Datumseingabe"}</SelectItem>
        </SelectContent>
      </Select>

      {controller.preset == DateFilterPreset.CUSTOM
        && <DateRangePicker
          placeholder={"Datum auswählen"}
          onChange={onChange}
        />}
    </>
  );
}
