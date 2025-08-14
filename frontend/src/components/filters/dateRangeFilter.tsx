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
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = useCallback((preset: Preset) => {
    let newRange: DateRange | undefined;
    switch (preset) {
      case Preset.TODAY:
        newRange = {
          from: new Date(),
          to: new Date()
        };
        break;
      case Preset.TOMORROW:
        newRange = {
          from: new Date().addDays(1),
          to: new Date().addDays(1)
        };
        break;
      case Preset.THIS_WEEK:
        newRange = {
          from: new Date(Math.max(new Date().startOfWeek().getTime(), new Date().getTime())),
          to: new Date().endOfWeek()
        };
        break;
      case Preset.NEXT_WEEK:
        newRange = {
          from: new Date().addDays(7).startOfWeek(),
          to: new Date().addDays(7).endOfWeek()
        };
        break;
      case Preset.THIS_MONTH:
        newRange = {
          from: new Date(Math.max(new Date().startOfMonth().getTime(), new Date().getTime())),
          to: new Date().endOfMonth()
        };
        break;
      case Preset.NEXT_MONTH:
        newRange = {
          from: new Date().addMonths(1).startOfMonth(),
          to: new Date().addMonths(1).endOfMonth()
        };
        break;
    }
    setRange(newRange);
    onChange(newRange);
    setIsOpen(false);
  }, [onChange]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Date")}</Label>
      <DropdownMenu open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) onChange(range);
      }}>
        <DropdownMenuTrigger asChild>
          <Button className="w-full bg-white text-primary hover:bg-neutral-100 hover:cursor-pointer justify-start">
            {`${value?.from?.formatDate() ?? '...'} - ${value?.to?.formatDate() ?? '...'}`}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-4 flex">
          <div className="flex flex-col gap-4">
            <Button onClick={() => { setRange(undefined); onChange(undefined); setIsOpen(false); }}>{t("Clear")}</Button>

            <div className="flex flex-col">
              <Button variant="ghost" onClick={() => handlePresetClick(Preset.TODAY)}>{t("Dates.Today")}</Button>
              <Button variant="ghost" onClick={() => handlePresetClick(Preset.TOMORROW)}>{t("Dates.Tomorrow")}</Button>
              <Button variant="ghost" onClick={() => handlePresetClick(Preset.THIS_WEEK)}>{t("Dates.ThisWeek")}</Button>
              <Button variant="ghost" onClick={() => handlePresetClick(Preset.NEXT_WEEK)}>{t("Dates.NextWeek")}</Button>
              <Button variant="ghost" onClick={() => handlePresetClick(Preset.THIS_MONTH)}>{t("Dates.ThisMonth")}</Button>
              <Button variant="ghost" onClick={() => handlePresetClick(Preset.NEXT_MONTH)}>{t("Dates.NextMonth")}</Button>
              <Button onClick={() => { onChange(range); setIsOpen(false); }}>{t("Dates.ConfirmDate")}</Button>
            </div>
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={r => setRange(r)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
