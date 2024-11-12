import { useGetLocations } from "@/endpoints/gubenProdComponents";
import { LocationFilterController } from "@/hooks/useLocationFilter";
import { Input } from "../ui/input";

interface Props {
  controller: LocationFilterController;
}

export const LocationFilter = (props: Props) => {
  return (
    <Input
      type="text"
      placeholder="Search"
      value={props.controller.searchText}
      onChange={(e) => props.controller.setSearchText(e.target.value)}
    />
  );
}
