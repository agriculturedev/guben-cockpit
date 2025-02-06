import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useCategoriesGetAll} from "@/endpoints/gubenComponents";
import {UseTextFilterHook} from "@/hooks/filters/useTextFilter";
import { useCallback } from "react";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import { t } from "i18next";

interface Props {
  controller: UseTextFilterHook;
  className?: string;
}

export const CategoryFilter = ({controller, className}: Props) => {
  const {data: categoriesData} = useCategoriesGetAll({});

  const onChange = useCallback((value: string) => {
    if(value == "none") return controller.clearFilter();
    const cat = categoriesData?.categories.find(c => c.id === value)?.id;
    controller.setFilter(cat ?? null);
  }, [categoriesData, controller]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Category")}</Label>
      <Select
        value={controller.filter ?? "none"}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kategorie"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"none"}>{t("Category")}</SelectItem>
          {categoriesData?.categories?.map(category => (category.name &&
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
