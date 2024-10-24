import {useCallback, useState} from "react";
import {FilterController, QueryFilter, UseFilterHook} from "@/types/filtering.types";
import {HashMap, Option} from "@/types/common.types";
import {getValidEnumValue} from "@/lib/enumUtils";

export enum DateFilterPreset {
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  THIS_WEEK = 'this_week',
  NEXT_WEEK = 'next_week',
  THIS_MONTH = 'this_month',
  NEXT_MONTH = 'next_month',
  THIS_YEAR = 'this_year',
}

type SetFromPresetFn = (preset: Option<string>) => void;
type SetDateRangeFn = (startDate: Option<Date>, endDate: Option<Date>) => void;
type DateQueryDefinition = [string, "min" | "max"];

interface QueryDefinitions {
  rangeQueries: DateQueryDefinition[];
  singleDateQueries: DateQueryDefinition[];
}

const queryDefinitions: QueryDefinitions = {
  rangeQueries: [
    ["filters[$and][0][$or][0][$and][0][startDate][$gte]", "min"],
    ["filters[$and][0][$or][0][$and][1][startDate][$lte]", "max"],
    ["filters[$and][0][$or][1][$and][0][endDate][$gte]", "min"],
    ["filters[$and][0][$or][1][$and][1][endDate][$lte]", "max"],
    ["filters[$and][0][$or][2][$and][0][startDate][$lte]", "min"],
    ["filters[$and][0][$or][2][$and][1][endDate][$gte]", "max"]
  ],
  singleDateQueries: [
    ["filters[$and][0][$and][0][startDate][$gte]", "min"],
    ["filters[$and][0][$and][0][endDate][$lte]", "min"]
  ]
}

// Flatten queryDefinitions into a HashMap of type {string: number} for quick indexing during the filtering of our filters list
const queryDefinitionsMap = Object.values(queryDefinitions).reduce((acc: HashMap<number>, val) => {
  for(let i = 0; i < val.length; i++) {
    acc[val[i][0]] = val[i][1];
  }
  return acc;
}, {});

export interface DateFilterController extends FilterController {
  selectedPreset: Option<DateFilterPreset>;
  selectedDateRange: [Option<Date>, Option<Date>]
  setSelectedDateRange: SetDateRangeFn;
  setFromPreset: SetFromPresetFn;
}

export const useDateFilter: UseFilterHook<DateFilterController> = (filters, setFilters) => {
  const [selectedPreset, setSelectedPreset] = useState<Option<DateFilterPreset>>(null);
  const [minDate, setMinDate] = useState<Option<Date>>(null);
  const [maxDate, setMaxDate] = useState<Option<Date>>(null);

  const setSelectedDateRange: SetDateRangeFn = useCallback((startDate, endDate) => {
    setMinDate(startDate);
    setMaxDate(endDate);

    const unchangedFilters = filters.filter(([k, _]) => !!queryDefinitionsMap[k]);
    const newFilters: QueryFilter[] = [...unchangedFilters];

    if(startDate && endDate) newFilters.push(...queryDefinitions.rangeQueries.map(def => [def[0], {"min": startDate, "max": endDate}[def[1]].toISOString()] as QueryFilter));
    else if(startDate) newFilters.push(...queryDefinitions.singleDateQueries.map(def => [def[0], startDate.toISOString()] as QueryFilter));

    setFilters(newFilters);
  }, [filters, selectedPreset]);

  const setFromPreset: SetFromPresetFn = useCallback((preset) => {
    const enumCast = getValidEnumValue(preset, DateFilterPreset);
    const [start, end] = getDatesFromPreset(enumCast);

    setSelectedPreset(enumCast);
    setSelectedDateRange(start, end);
  }, []);

  return {
    selectedPreset,
    selectedDateRange: [minDate, maxDate],
    setFromPreset,
    setSelectedDateRange
  };
}

function getDatesFromPreset(dateFilter: Option<DateFilterPreset>): [Option<Date>, Option<Date>] {
  const today = new Date();
  switch (dateFilter) {
    case DateFilterPreset.TODAY:
      return [today, null];

    case DateFilterPreset.TOMORROW:
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return [tomorrow, null];

    case DateFilterPreset.NEXT_WEEK:
      const startOfNextWeek = new Date(today);
      startOfNextWeek.setDate(today.getDate() + (7 - today.getDay()) + 1);
      const endOfNextWeek = new Date(startOfNextWeek);
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
      return [startOfNextWeek, endOfNextWeek];

    case DateFilterPreset.THIS_WEEK:
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
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

    default:
      return [null, null];
  }
}