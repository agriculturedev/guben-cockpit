import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { XIcon } from "lucide-react";

interface Props {
  value?: DateRange;
  onChange: (range?: DateRange) => unknown;
  className?: string;
}

enum Preset {
  TODAY = "today",
  TOMORROW = "tomorrow",
  THIS_WEEK = "thisWeek",
  NEXT_WEEK = "nextWeek",
  THIS_MONTH = "thisMonth",
  NEXT_MONTH = "nextMonth"
}

export const DateRangeFilter = ({
  value,
  onChange,
  className
}: Props) => {
  const { t } = useTranslation("common");

  const [range, setRange] = useState<DateRange | undefined>(value);

  const handlePresetClick = useCallback((preset: Preset) => {
    switch (preset) {
      case Preset.TODAY:
        return setRange({
          from: new Date(),
          to: new Date()
        });
      case Preset.TOMORROW:
        return setRange({
          from: new Date().addDays(1),
          to: new Date().addDays(1)
        });
      case Preset.THIS_WEEK:
        return setRange({
          from: new Date(Math.max(new Date().startOfWeek().getTime(), new Date().getTime())),
          to: new Date().endOfWeek()
        });
      case Preset.NEXT_WEEK:
        return setRange({
          from: new Date().addDays(7).startOfWeek(),
          to: new Date().addDays(7).endOfWeek()
        });
      case Preset.THIS_MONTH:
        return setRange({
          from: new Date(Math.max(new Date().startOfMonth().getTime(), new Date().getTime())),
          to: new Date().endOfMonth(),
        });
      case Preset.NEXT_MONTH:
        return setRange({
          from: new Date().addMonths(1).startOfMonth(),
          to: new Date().addMonths(1).endOfMonth()
        })
    }
  }, []);

  const handleClose = useCallback((isopen: boolean) => {
    if (!isopen) onChange(range);
  }, [range]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Date")}</Label>
      <DropdownMenu onOpenChange={handleClose}>
        <DropdownMenuTrigger asChild>
          <Button className="w-full bg-white text-primary hover:bg-neutral-100 hover:cursor-pointer justify-start">
            {`${value?.from?.formatDate() ?? '...'} - ${value?.to?.formatDate() ?? '...'}`}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-4 flex">
          <div className="flex flex-col gap-4">
            <Button onClick={_ => setRange({ from: undefined, to: undefined })}>Clear</Button>

            <div className="flex flex-col">
              <Button variant="ghost" onClick={_ => handlePresetClick(Preset.TODAY)}>{t("Dates.Today")}</Button>
              <Button variant="ghost" onClick={_ => handlePresetClick(Preset.TOMORROW)}>{t("Dates.Tomorrow")}</Button>
              <Button variant="ghost" onClick={_ => handlePresetClick(Preset.THIS_WEEK)}>{t("Dates.ThisWeek")}</Button>
              <Button variant="ghost" onClick={_ => handlePresetClick(Preset.NEXT_WEEK)}>{t("Dates.NextWeek")}</Button>
              <Button variant="ghost" onClick={_ => handlePresetClick(Preset.THIS_MONTH)}>{t("Dates.ThisMonth")}</Button>
              <Button variant="ghost" onClick={_ => handlePresetClick(Preset.NEXT_MONTH)}>{t("Dates.NextMonth")}</Button>
            </div>
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
