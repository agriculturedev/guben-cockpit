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
                <SelectItem value={DateFilterPreset.TODAY}>{DateFilterPreset.TODAY}</SelectItem>
                <SelectItem value={DateFilterPreset.TOMORROW}>{DateFilterPreset.TOMORROW}</SelectItem>
                <SelectItem value={DateFilterPreset.THIS_WEEK}>{DateFilterPreset.THIS_WEEK}</SelectItem>
                <SelectItem value={DateFilterPreset.NEXT_WEEK}>{DateFilterPreset.NEXT_WEEK}</SelectItem>
                <SelectItem value={DateFilterPreset.THIS_MONTH}>{DateFilterPreset.THIS_MONTH}</SelectItem>
                <SelectItem value={DateFilterPreset.NEXT_MONTH}>{DateFilterPreset.NEXT_MONTH}</SelectItem>
                <SelectItem value={DateFilterPreset.THIS_YEAR}>{DateFilterPreset.THIS_YEAR}</SelectItem>
            </SelectContent>
        </Select>
    );
}
