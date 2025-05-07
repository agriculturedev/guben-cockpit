import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  className?: string;
  onChange: (dateRange?: DateRange) => void;
  placeholder?: string;
}

const dateFormat = "LLL dd, y";

export default function DateRangePicker(props: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();

  const dateString = useMemo(() => {
    const fStart = range?.from && format(range?.from, dateFormat)
    const fEnd = range?.to && format(range?.to, dateFormat);

    if(fStart && fEnd) return `${fStart} - ${fEnd}`;
    if(fStart) return fStart;
    return props.placeholder ?? "Select date";
  }, [range]);

  const handleSelect = useCallback((newRange?: DateRange) => {
    setRange(newRange);
    props.onChange(newRange);
  }, []);

  return (
    <div className={cn("grid gap-2", props.className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal gap-4",
              !range && "text-muted-foreground",
              "bg-white"
            )}
          >
            {dateString}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
