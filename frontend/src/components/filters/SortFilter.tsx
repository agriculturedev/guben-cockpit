import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {SortingDirection, UseSortingFilterHook} from "@/hooks/filters/useSortingFilter";
import {useCallback} from "react";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import { t } from "i18next";

interface Props {
  controller: UseSortingFilterHook;
  className?: string;
}

enum SortingOptions {
  NONE = "none",
  TITLE_ASC = "title:ascending",
  TITLE_DESC = "title:descending",
  DATE_ASC = "startDate:ascending",
  DATE_DESC = "startDate:descending",
}

export const SortFilter = ({controller, className}: Props) => {
  const handleChange = useCallback((value: string) => {
    if(value == SortingOptions.NONE) return controller.clearFilter();
    const [field, direction] = value.split(":");
    controller.setFilter(field, direction as SortingDirection);
  }, [controller]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Sorting.Title")}</Label>
      <Select
        value={controller.filter.field
          && controller.filter.direction
          && `${controller.filter.field}:${controller.filter.direction}`
          || "none"}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("Sorting.Title")}/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SortingOptions.NONE}>{t("Sorting.Title")}</SelectItem>
          <SelectItem value={SortingOptions.TITLE_ASC}>{`${t("Title")} ${t("Sorting.Ascending")}`}</SelectItem>
          <SelectItem value={SortingOptions.TITLE_DESC}>{`${t("Title")} ${t("Sorting.Descending")}`}</SelectItem>
          <SelectItem value={SortingOptions.DATE_ASC}>{`${t("Date")} ${t("Sorting.Ascending")}`}</SelectItem>
          <SelectItem value={SortingOptions.DATE_DESC}>{`${t("Date")} ${t("Sorting.Descending")}`}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
