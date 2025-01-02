import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CategoryFilterController} from "@/hooks/useCategoryFilter";
import {useGetCategories} from "@/endpoints/gubenProdComponents";
import {useCategoriesGetAll} from "@/endpoints/gubenComponents";

interface Props {
  controller: CategoryFilterController;
}

export const CategoryFilter = (props: Props) => {
  const {data: categoriesData} = useCategoriesGetAll({});

  return (
    <Select
      value={props.controller.category ?? "none"}
      onValueChange={cat => props.controller.setCategory(cat === "none" ? null : cat)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Kategorie"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"none"}>(Kategorie)</SelectItem>
        {categoriesData?.categories?.map(category => (category.name &&
          <SelectItem
            key={category.id}
            value={category.name}
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
