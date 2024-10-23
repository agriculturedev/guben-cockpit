import {useCallback} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CategoryFilterController} from "@/hooks/useCategoryFilter";
import {useGetCategories} from "@/endpoints/gubenProdComponents";

interface Props {
    categoryFilterController: CategoryFilterController;
}

export const CategoryFilter = (props: Props) => {

    const setCategoryFilter = useCallback((category: string) => {
        if (category === "<keine/lehr>") {
            category = "";
        }
        props.categoryFilterController.setCategory(category);
    },[props.categoryFilterController]);

    const {
        data,
    } = useGetCategories({queryParams: {}});

    return (
        <Select onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"<keine/lehr>"}>(keine)</SelectItem>
                {data && data.data && data.data.map((category) => {
                    const value = category.attributes?.Name;
                    return (
                        <SelectItem key={category.id} value={value ?? ""}>{value}</SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
