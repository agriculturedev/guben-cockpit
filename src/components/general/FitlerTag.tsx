import {Tag, TagProps} from "@/components/general/Tag";
import {CircleX} from "lucide-react";
import * as React from "react";
import {ClearFilterCallback} from "@/types/filtering.types";

interface FilterTagProps extends TagProps {
  title: string;
  value: string;
  onClear: ClearFilterCallback
}

export const FilterTag = (props: FilterTagProps) => {
  const tagProps = props as TagProps;

  return (
    <Tag {...tagProps}>
      <div className={"flex gap-2 items-center"}>
        <p>{props.title}: {props.value}</p>
        <CircleX
          className={"hover:cursor-pointer"}
          size={16}
          onClick={props.onClear}
        />
      </div>
    </Tag>
  )
}