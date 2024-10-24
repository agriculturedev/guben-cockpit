import {DateRangeFilter} from "@/components/filters/DateRangeFilter";
import {TextFilter} from "@/components/filters/TextFilter";
import * as React from "react";
import {CategoryFilter} from "@/components/filters/CategoryFilter";
import {useEventFilters} from "@/context/eventFilters/EventFiltersContext";

export const EventFilterContainer = () => {
  const {controllers} = useEventFilters();

  return (
    <div className={"flex py-2 gap-2"}>
      <div>
        <TextFilter controller={controllers.textController}/>
      </div>
      <DateRangeFilter controller={controllers.dateController}/>
      <CategoryFilter controller={controllers.categoryController}/>
    </div>
  );
}
