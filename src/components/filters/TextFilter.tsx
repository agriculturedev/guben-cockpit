import {Input} from "@/components/ui/input"
import {TextFilterController} from "@/hooks/useTextFilter";

interface Props {
  controller: TextFilterController;
}

export function TextFilter({controller}: Props) {
  return (
    <Input
      type="text"
      placeholder="Search"
      value={controller.searchText}
      onChange={(e) => controller.setSearchText(e.target.value)}
    />
  )
}
