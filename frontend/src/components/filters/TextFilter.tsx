import {Input} from "@/components/ui/input"
import {TextFilterController} from "@/hooks/useTextFilter";

interface Props {
  controller: TextFilterController;
  placeHolder: string;
}

export function TextFilter({controller, placeHolder}: Props) {
  return (
    <Input
      type="text"
      placeholder={placeHolder}
      value={controller.searchText}
      onChange={(e) => controller.setSearchText(e.target.value)}
    />
  )
}
