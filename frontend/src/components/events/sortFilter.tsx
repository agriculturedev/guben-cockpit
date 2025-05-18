import { SortDescIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export enum SortOption {
  NONE = "none",
  TITLE = "title",
  START_DATE = "startDate",
}

export enum SortOrder {
  ASC = "ascending",
  DESC = "descending"
}

type Props = {
  option?: SortOption,
  order?: SortOrder
  onChange: (options?: string, order?: string) => unknown;
}

export default function SortFilter({
  option = SortOption.NONE,
  order = SortOrder.ASC,
  onChange
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><SortDescIcon className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2">
        <DropdownMenuLabel>Option</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={option} onValueChange={v => onChange(v == "none" ? undefined : v, order)}>
          <DropdownMenuRadioItem value={SortOption.NONE}>(none)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortOption.TITLE}>Title</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortOption.START_DATE}>Date</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuLabel>Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={order} onValueChange={v => onChange(option, v)}>
          <DropdownMenuRadioItem value={SortOrder.ASC}>Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortOrder.DESC}>Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
