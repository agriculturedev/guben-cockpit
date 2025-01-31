import {Input} from "@/components/ui/input"
import {UseTextFilterHook} from "@/hooks/filters/useTextFilter";

interface Props {
  controller: UseTextFilterHook;
  placeHolder: string;
}

export function TextFilter({controller, placeHolder}: Props) {
  return (
    <Input
      type="text"
      placeholder={placeHolder}
      value={controller.filter ?? ""}
      onChange={(e) => controller.setFilter(e.target.value)}
    />
  )
}
