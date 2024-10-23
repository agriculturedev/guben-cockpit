import {Input} from "@/components/ui/input"
import {EventFilterController} from "@/context/events/EventFiltersContext";

interface Props {
  controller: EventFilterController<string>;
}

export function TextFilter({controller}: Props) {
  return (
    <Input
      type="text"
      placeholder="Search"
      value={controller.value}
      onChange={(e) => controller.setValue(e.target.value)}
    />
  )
}
