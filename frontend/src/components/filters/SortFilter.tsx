import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {SortingDirection, UseSortingFilterHook} from "@/hooks/filters/useSortingFilter";
import {useCallback} from "react";

interface Props {
  controller: UseSortingFilterHook;
}

enum SortingOptions {
  NONE = "none",
  TITLE_ASC = "title:ascending",
  TITLE_DESC = "title:descending",
  DATE_ASC = "startDate:ascending",
  DATE_DESC = "startDate:descending",
}

export const SortFilter = ({controller}: Props) => {
  const handleChange = useCallback((value: string) => {
    if(value == SortingOptions.NONE) return controller.clearFilter();
    const [field, direction] = value.split(":");
    controller.setFilter(field, direction as SortingDirection);
  }, [controller]);

  return (
    <Select
      value={controller.filter.field
        && controller.filter.direction
        && `${controller.filter.field}:${controller.filter.direction}`
        || "none"}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sortierung"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={SortingOptions.NONE}>{"Sortierung"}</SelectItem>
        <SelectItem value={SortingOptions.TITLE_ASC}>{"Titel Aufsteigend"}</SelectItem>
        <SelectItem value={SortingOptions.TITLE_DESC}>{"Titel Absteigend"}</SelectItem>
        <SelectItem value={SortingOptions.DATE_ASC}>{"Datum Aufsteigend"}</SelectItem>
        <SelectItem value={SortingOptions.DATE_DESC}>{"Datum Absteigend"}</SelectItem>
      </SelectContent>
    </Select>
  );
}
