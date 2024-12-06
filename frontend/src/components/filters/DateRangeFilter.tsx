import { DateFilterController, DateFilterPreset } from "@/hooks/useDateFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/dateRangePicker";
import { DateRange } from "react-day-picker"
import { Option } from "@/types/common.types";
import { useCallback } from "react";

interface Props {
  controller: DateFilterController;
}

export const DateRangeFilter = ({controller}: Props) => {

  const toDateRange = (dateRange: [Option<Date>, Option<Date>]) : DateRange => {
    return {
      from: dateRange[0] ?? undefined,
      to: dateRange[1] ?? undefined
    }
  }

  const onChange = useCallback((dateRange?: DateRange ) => {
    controller.setSelectedDateRange(dateRange?.from ?? null, dateRange?.to ?? null);
  }, [controller]);

  return (
    <>
      <Select
        value={controller.selectedPreset ?? "none"}
        onValueChange={preset => controller.setFromPreset(preset === "none" ? null : preset)}
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

      {controller.selectedPreset == DateFilterPreset.CUSTOM &&
        <DateRangePicker dateRange={toDateRange(controller.selectedDateRange)} onChange={onChange}/>
      }
    </>
  );
}
