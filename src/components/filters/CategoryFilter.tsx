import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CategoryFilterController} from "@/hooks/useCategoryFilter";
import {useGetCategories} from "@/endpoints/gubenProdComponents";

interface Props {
  controller: CategoryFilterController;
}

export const CategoryFilter = (props: Props) => {
  const {data} = useGetCategories({queryParams: {}});

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
        {data?.data?.map(category => (category.attributes?.Name &&
          <SelectItem
            key={category.id}
            value={category.attributes.Name}
          >
            {category.attributes.Name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
