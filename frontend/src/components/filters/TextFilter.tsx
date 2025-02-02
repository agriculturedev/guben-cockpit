import {Input} from "@/components/ui/input"
import {UseTextFilterHook} from "@/hooks/filters/useTextFilter";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";

interface Props {
  controller: UseTextFilterHook;
  placeHolder: string;
  className?: string;
}

export function TextFilter({controller, placeHolder, className}: Props) {
  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>Suchen</Label>
      <Input
        type="text"
        placeholder={placeHolder}
        value={controller.filter ?? ""}
        onChange={(e) => controller.setFilter(e.target.value)}
      />
    </div>
  )
}
