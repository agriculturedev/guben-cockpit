import { useLocationsGetAll } from "@/endpoints/gubenComponents";
import { Combobox, ComboboxOption } from "../ui/comboBox";
import { useMemo, useState } from "react";

export default function EventsFilterSection() {
  return (
    <div className="flex gap-4">
      <LocationsFilter />
    </div>
  );
}

function LocationsFilter() {
  const { data } = useLocationsGetAll({});

  const defaultLocation = useMemo(() => {
    return data
      ?.locations
      .find(l => l.city?.localeCompare("guben", undefined, {sensitivity: "accent"}))
      ?.id
      ?? null;
  }, [data?.locations]);
  const [location, setLocation] = useState<string | null>(defaultLocation);

  const comboOptions = useMemo(() => {
    if (!data?.locations) return [];
    const index = data.locations.reduce((acc: { [k: string]: ComboboxOption }, loc) => {
      const label = `${loc.city}, ${loc.zip}`;
      if (!acc[label]) acc[label] = { label, value: loc.id };
      return acc;
    }, {});
    return Object.values(index);
  }, [data?.locations]);

  return (
    <Combobox
      options={comboOptions}
      placeholder="location"
      value={location}
      onSelect={setLocation}
    />
  )
}
