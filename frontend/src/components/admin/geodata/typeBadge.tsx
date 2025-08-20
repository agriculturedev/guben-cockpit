import type { GeodataType } from "./geodataManagerTab";

interface TypeBadgeProps {
  type: GeodataType;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const map: Record<GeodataType, string> = {
    WFS: "WFS (Service)",
    WMS: "WMS (Service)"
  };

  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs">
      {map[type]}
    </span>
  );
};
