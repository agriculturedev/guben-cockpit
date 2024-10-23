import {DateRangeFilter} from "@/components/filters/DateRangeFilter";
import {TextFilter} from "@/components/filters/TextFilter";
import * as React from "react";
import {useEventFilters} from "@/context/events/EventFiltersContext";
import {CategoryFilter} from "@/components/filters/CategoryFilter";

export const EventFilterContainer = () => {
  const {controllers} = useEventFilters();

  return (
    <div className={"flex py-2 gap-2"}>
      <div>
        <TextFilter controller={controllers.textController}/>
      </div>
      <DateRangeFilter dateRangeFilterController={controllers.dateController}/>
      <CategoryFilter categoryFilterController={controllers.categoryController}/>
    </div>
  );
}
