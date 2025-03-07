import { Option } from "@/types/common.types";
import { useEffect, useState } from "react";

type DateRange = { startDate: Option<Date>, endDate: Option<Date> };
type ValueType = DateRange | DateFilterPreset;

export enum DateFilterPreset {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'this_week',
  NEXT_WEEK = 'next_week',
  THIS_MONTH = 'this_month',
  NEXT_MONTH = 'next_month',
  THIS_YEAR = 'this_year',
  FUTURE = 'future',
  CUSTOM = 'custom'
}

export type UseDateRangeFilterHook = ReturnType<typeof useDateRangeFilter>;

export function useDateRangeFilter(defaultPreset?: DateFilterPreset) {
  const [preset, setPreset] = useState<DateFilterPreset | undefined>(defaultPreset);

  const [startDate, setStartDate] = useState<Option<Date>>(null);
  const [endDate, setEndDate] = useState<Option<Date>>(null);

  useEffect(() => { // otherwise defaultPreset is not applied on load
    setFilter(defaultPreset);
  }, [defaultPreset])

  function setFilter(value?: ValueType) {
    if(value === undefined) return clearFilter();

    if (IsDateRange(value)) {
      setPreset(DateFilterPreset.CUSTOM);
      setStartDate(value.startDate);
      setEndDate(value.endDate);
    } else {
      setPreset(value);
      const [start, end] = getDatesFromPreset(value);
      setStartDate(start);
      setEndDate(end);
    }
  }

  function clearFilter() {
    setPreset(defaultPreset);
    setStartDate(null);
    setEndDate(null)
  }

  return {
    preset,
    filter: {startDate, endDate},
    setFilter,
    clearFilter
  }
}

function IsDateRange(value: unknown): value is DateRange {
  return !!value
    && typeof value == "object"
    && "startDate" in value
    && "endDate" in value;
}

function getDatesFromPreset(dateFilter: Option<DateFilterPreset>): [Option<Date>, Option<Date>] {
  const today = new Date();
  switch (dateFilter) {
    case DateFilterPreset.TODAY:
      return [today, today];

    case DateFilterPreset.TOMORROW:
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return [tomorrow, tomorrow];

    case DateFilterPreset.NEXT_WEEK:
      const startOfNextWeek = new Date(today);
      startOfNextWeek.setDate(today.getDate() + (7 - today.getDay()) + 1);
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      return [startOfNextWeek, endOfNextWeek];

    case DateFilterPreset.THIS_WEEK:
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1 );
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return [startOfWeek, endOfWeek];

    case DateFilterPreset.THIS_MONTH:
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return [startOfMonth, endOfMonth];

    case DateFilterPreset.NEXT_MONTH:
      const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      return [startOfNextMonth, endOfNextMonth];

    case DateFilterPreset.THIS_YEAR:
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      return [startOfYear, endOfYear];

    case DateFilterPreset.FUTURE:
      const tenYearsAhead = new Date(today.getFullYear()+10, today.getMonth(), today.getDate());
      return [today, tenYearsAhead];

    default:
      return [null, null];
  }
}
