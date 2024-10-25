import {DateFilterController, DateFilterPreset} from "@/hooks/useDateFilter";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface Props {
    controller: DateFilterController;
}

export const DateRangeFilter = ({controller}: Props) => {
    return (
        <Select onValueChange={preset => controller.setFromPreset(preset)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Datum" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={DateFilterPreset.TODAY}>{"heute"}</SelectItem>
                <SelectItem value={DateFilterPreset.TOMORROW}>{"morgen"}</SelectItem>
                <SelectItem value={DateFilterPreset.THIS_WEEK}>{"diese woche"}</SelectItem>
                <SelectItem value={DateFilterPreset.NEXT_WEEK}>{"nächste woche"}</SelectItem>
                <SelectItem value={DateFilterPreset.THIS_MONTH}>{"diesen monat"}</SelectItem>
                <SelectItem value={DateFilterPreset.NEXT_MONTH}>{"nächsten monat"}</SelectItem>
                <SelectItem value={DateFilterPreset.THIS_YEAR}>{"dieses jahr"}</SelectItem>
            </SelectContent>
        </Select>
    );
}
