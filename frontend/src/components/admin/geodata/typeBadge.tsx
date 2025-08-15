import type { GeodataType } from "./geodataManagerTab";

interface TypeBadgeProps {
  type: GeodataType;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const map: Record<GeodataType, string> = {
    service_wms: "WMS (Service)",
    service_wfs: "WFS (Service)",
    file_vector: "Vector (File)",
    file_raster: "Raster (File)",
  };

  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
      {map[type]}
    </span>
  );
};
