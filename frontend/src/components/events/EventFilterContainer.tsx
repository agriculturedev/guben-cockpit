import {useEventFilters} from "@/context/eventFilters/EventFiltersContext";
import {TextFilter} from "@/components/filters/TextFilter";
import {DateRangeFilter} from "@/components/filters/DateRangeFilter";
import {SortFilter} from "@/components/filters/SortFilter";
import {LocationFilter} from "@/components/filters/LocationFilter";
import {CategoryFilter} from "@/components/filters/CategoryFilter";
import {ReactNode, useMemo } from "react";
import {getContrast, getHexColorFromText, hexToRgb } from "@/utilities/colorUtils";
import {FilterTag} from "@/components/general/FilterTag";
import {useCategoriesGetAll} from "@/endpoints/gubenComponents";

export const EventFilterContainer = () => {
  const {controllers} = useEventFilters();
  const {data: categories} = useCategoriesGetAll({});

  const tagElements = useMemo(() => {
    const elements: ReactNode[] = [];
    if (controllers.category.filter) {
      const color = getHexColorFromText(controllers.category.filter ?? "");
      const contrast = getContrast(hexToRgb(color)!, [255, 255, 255]);

      const cat = categories
        ?.categories
        .find(c => c.id === controllers.category.filter)
        ?.name ?? "Unknown category";

      elements.push(<FilterTag
        key={"category"}
        bgColor={color}
        textColor={contrast < 4.5 ? "#000000" : "#ffffff"}
        title={"Kategorie"}
        value={cat}
        onClear={controllers.category.clearFilter}
      />)
    }

    if (controllers.dateRange.filter.startDate || controllers.dateRange.filter.endDate) {
      const {startDate, endDate} = controllers.dateRange.filter;
      let filterString = startDate?.formatDate();
      if (endDate) filterString += " - " + endDate.formatDate();
      elements.push(<FilterTag
        key={"date"}
        title={(startDate && endDate) ? "Datumsbereich" : "Datum"}
        value={filterString ?? ""}
        onClear={controllers.dateRange.clearFilter}
      />)
    }

    return elements;
  }, [controllers]);

  return (
    <div className={"flex gap-2 flex-col mb-2"}>
      <div className={"flex p-0 gap-2"}>
        <TextFilter controller={controllers.title} placeHolder={"Search"}/>
        <LocationFilter controller={controllers.location} placeHolder={"Location"} />
        <DateRangeFilter controller={controllers.dateRange}/>
        <SortFilter controller={controllers.sorting}/>
        <CategoryFilter controller={controllers.category}/>
      </div>

      <div className={"flex gap-2"}>{tagElements}</div>
    </div>
  );
}
