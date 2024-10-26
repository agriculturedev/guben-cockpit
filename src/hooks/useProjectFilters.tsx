import {useTextFilter} from "@/hooks/useTextFilter";
import {QueryFilter, SetFiltersCallback} from "@/types/filtering.types";


export const useProjectFilters = (filters: QueryFilter[], setFilters: SetFiltersCallback) => {
    const textController = useTextFilter(filters, setFilters);

    return {
        textController
    };
}
