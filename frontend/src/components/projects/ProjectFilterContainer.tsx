import {TextFilter} from "@/components/filters/TextFilter";
import * as React from "react";
import {useProjectFilters} from "@/hooks/useProjectFilters";
import {SetFiltersCallback} from "@/types/filtering.types";

interface Props {
    filters: [string, string][];
    setFilters: SetFiltersCallback;
}

export const ProjectFilterContainer = ({filters, setFilters}: Props) => {
    const {
        textController
    } = useProjectFilters(filters, setFilters);

    return (
        <div className={"flex py-2"}>
            <div>
                <TextFilter controller={textController}/>
            </div>
        </div>
    );
}
