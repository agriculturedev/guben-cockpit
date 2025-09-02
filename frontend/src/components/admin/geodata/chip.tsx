import { cn } from "@/lib/utils";

export interface ChipProps {
  label: string;
  tone?: "green" | "blue" | "gray";
}

export const Chip: React.FC<ChipProps> = ({ label, tone = "gray" }) => {
  const toneCls =
    tone === "green"
      ? "bg-green-100 text-green-800"
      : tone === "blue"
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-800";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs",
        toneCls,
      )}
    >
      {label}
    </span>
  );
};
