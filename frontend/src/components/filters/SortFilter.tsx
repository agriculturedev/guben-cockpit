import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { SORT_OPTIONS, SorterController } from "@/hooks/useSorter";

interface Props {
  controller: SorterController;
}

export const SortFilter = ({controller}: Props) => {
  return (
    <Select
      value={controller.sortOption ?? "none"}
      onValueChange={preset => controller.setSortOption(preset === "none" ? null : preset)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sortierung"/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"none"}>(Sortierung)</SelectItem>
        <SelectItem value={SORT_OPTIONS.TITLE_ASC}>{"Titel Aufsteigend"}</SelectItem>
        <SelectItem value={SORT_OPTIONS.TITLE_DESC}>{"Titel Absteigend"}</SelectItem>
        <SelectItem value={SORT_OPTIONS.DATE_ASC}>{"Datum Aufsteigend"}</SelectItem>
        <SelectItem value={SORT_OPTIONS.DATE_DESC}>{"Datum Absteigend"}</SelectItem>
      </SelectContent>
    </Select>
  );
}
