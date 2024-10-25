import {DateRangeFilter} from "@/components/filters/DateRangeFilter";
import {TextFilter} from "@/components/filters/TextFilter";
import * as React from "react";
import {CategoryFilter} from "@/components/filters/CategoryFilter";
import {useEventFilters} from "@/context/eventFilters/EventFiltersContext";
import {Tag} from "@/components/general/Tag";
import {useMemo} from "react";
import {ReactNode} from "@tanstack/react-router";
import {getContrast, getHexColorFromText, hexToRgb} from "@/lib/colorUtils";
import {CircleX} from "lucide-react";

export const EventFilterContainer = () => {
  const {controllers} = useEventFilters();

  const tagElements = useMemo(() => {
    const elements: ReactNode[] = [];

    if(controllers.categoryController.category) {
      const color = getHexColorFromText(controllers.categoryController.category);
      const contrast = getContrast(hexToRgb(color)!, [255,255,255]);

      elements.push(<Tag
        key={"category"}
        bgColor={color}
        textColor={contrast < 4.5 ? "#000000" : "#ffffff"}
      >
        <div className={"flex gap-2 items-center"}>
          <p>Kategorie: {controllers.categoryController.category}</p>
          <CircleX
            className={"hover:cursor-pointer"}
            size={16}
            onClick={() => controllers.categoryController.clearFilter()}
          />
        </div>
      </Tag>);
    }

    if(controllers.dateController.selectedDateRange.filter(i => !!i).length > 0) {
      const [startDate, endDate] = controllers.dateController.selectedDateRange;
      let filterString = startDate?.formatDate();
      if(endDate) filterString += " - " + endDate.formatDate();
      elements.push(
        <Tag key={"date"}>
          <div className={"flex gap-2 items-center"}>
            <p>{(startDate && endDate) ? "Datumsbereich" : "Datum"}: {filterString}</p>
            <CircleX
              className={"hover:cursor-pointer"}
              size={16}
              onClick={() => controllers.dateController.clearFilter()}
            />
          </div>
        </Tag>
      )
    }

    return elements;
  }, [controllers]);

  return (
    <div className={"flex gap-2 flex-col mb-2"}>
      <div className={"flex p-0 gap-2"}>
        <TextFilter controller={controllers.textController}/>
        <DateRangeFilter controller={controllers.dateController}/>
        <CategoryFilter controller={controllers.categoryController}/>
      </div>

      <div className={"flex gap-2"}>{tagElements}</div>
    </div>
  );
}
