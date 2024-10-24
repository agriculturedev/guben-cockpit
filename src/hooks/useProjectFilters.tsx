import {useTextFilter} from "@/hooks/useTextFilter";
import {Dispatch, SetStateAction} from "react";
import {QueryFilter} from "@/types/filtering.types";


export const useProjectFilters = (filters: QueryFilter[], setFilters: Dispatch<SetStateAction<QueryFilter[]>>) => {
    const textController = useTextFilter(filters, setFilters);

    return {
        textController
    };
}
