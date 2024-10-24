import {useCallback, useState} from "react";
import {FilterController, UseFilterHook} from "@/types/filtering.types";

export interface CategoryFilterController extends FilterController {
    setCategory: (searchText: string) => void;
    category: string;
}

const queryDefinition = "filters[categories][Name][$eq]";

export const useCategoryFilter: UseFilterHook<CategoryFilterController> = (filters, setFilters) => {
    const [category, _setCategory] = useState<string>('');

    const setCategory = useCallback((value: string) => {
        _setCategory(value);
        const newFilters = filters.filter(([k, _]) => k !== queryDefinition);
        if (value !== '') newFilters.push([queryDefinition, value]);
        setFilters([...newFilters]);
    }, []);

    return {
        category,
        setCategory
    } as CategoryFilterController;
}
