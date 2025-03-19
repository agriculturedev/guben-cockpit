import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker"
import * as React from "react";
import { useCallback } from "react";
import { DateFilterPreset, UseDateRangeFilterHook } from "@/hooks/filters/useDateRangeFilter";
import DateRangePicker from "../inputs/DateRangePicker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarIcon } from "lucide-react";

interface Props {
  controller: UseDateRangeFilterHook;
  className?: string;
}

export const DateRangeFilter = ({controller, className}: Props) => {
  const {t} = useTranslation();

  const onChange = useCallback((newRange?: DateRange ) => {
    controller.setFilter({
      startDate: newRange?.from ?? null,
      endDate: newRange?.to ?? null
    });
  }, [controller]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>Datum</Label>
      <Select
        value={controller.preset ?? "none"}
        onValueChange={preset => controller.setFilter(preset as DateFilterPreset)}
      >
        <SelectTrigger className={"min-w-[10rem]"}>
          <SelectValue placeholder="Datum"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"none"}>{t("Dates.Always")}</SelectItem>
          <SelectItem value={DateFilterPreset.FUTURE}>{t("Dates.Future")}</SelectItem>
          <SelectItem value={DateFilterPreset.TODAY}>{t("Dates.Today")}</SelectItem>
          <SelectItem value={DateFilterPreset.TOMORROW}>{t("Dates.Tomorrow")}</SelectItem>
          <SelectItem value={DateFilterPreset.THIS_WEEK}>{t("Dates.ThisWeek")}</SelectItem>
          <SelectItem value={DateFilterPreset.NEXT_WEEK}>{t("Dates.NextWeek")}</SelectItem>
          <SelectItem value={DateFilterPreset.THIS_MONTH}>{t("Dates.ThisMonth")}</SelectItem>
          <SelectItem value={DateFilterPreset.NEXT_MONTH}>{t("Dates.NextMonth")}</SelectItem>
          <SelectItem value={DateFilterPreset.THIS_YEAR}>{t("Dates.ThisYear")}</SelectItem>
          <SelectItem value={DateFilterPreset.CUSTOM}>
            <div className={"flex gap-2 items-center"} >
              <p>{t("Dates.DateInput")}</p>
              <CalendarIcon />
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {controller.preset == DateFilterPreset.CUSTOM
        && <DateRangePicker
          placeholder={"Datum auswählen"}
          onChange={onChange}
        />}
    </div>
  );
}
