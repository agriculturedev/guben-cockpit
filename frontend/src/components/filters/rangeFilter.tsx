import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Label } from "../ui/label";

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
    if(!isopen) onChange(range);
  }, [range]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Date")}</Label>
      <DropdownMenu onOpenChange={handleClose}>
        <DropdownMenuTrigger asChild>
          <Button className="bg-white text-primary hover:bg-neutral-100 hover:cursor-pointer justify-start">
            {`${value?.from?.formatDate() ?? '...'} - ${value?.to?.formatDate() ?? '...'}`}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-4 flex">
          <div className="flex flex-col justify-center">
            <Button variant="ghost" onClick={_ => handlePresetClick(Preset.TODAY)}>today</Button>
            <Button variant="ghost" onClick={_ => handlePresetClick(Preset.TOMORROW)}>tomorrow</Button>
            <Button variant="ghost" onClick={_ => handlePresetClick(Preset.THIS_WEEK)}>this week</Button>
            <Button variant="ghost" onClick={_ => handlePresetClick(Preset.NEXT_WEEK)}>next week</Button>
            <Button variant="ghost" onClick={_ => handlePresetClick(Preset.THIS_MONTH)}>this month</Button>
            <Button variant="ghost" onClick={_ => handlePresetClick(Preset.NEXT_MONTH)}>next month</Button>
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: new Date() }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
