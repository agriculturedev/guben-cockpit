import { LocationFilterController } from "@/hooks/useLocationFilter";
import { Input } from "../ui/input";
import { useEffect } from "react";

interface Props {
  controller: LocationFilterController;
  defaultValue?: string;
}

export const LocationFilter = ({controller, defaultValue}: Props) => {

  useEffect(() => {
    controller.setSearchText(defaultValue ?? "");
  }, [defaultValue])

  return (
    <Input
      type="text"
      placeholder="Location"
      defaultValue={defaultValue}
      value={controller.searchText}
      onChange={(e) => controller.setSearchText(e.target.value)}
    />
  );
}
