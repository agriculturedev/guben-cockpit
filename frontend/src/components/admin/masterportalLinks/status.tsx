import { MasterportalLinkStatus } from "@/endpoints/gubenSchemas";
import { cn } from "@/lib/utils";

type StatusProps = {
  value: MasterportalLinkStatus;
};

export const Status = ({ value }: StatusProps) => {
  const color =
    {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    }[value] ?? "bg-gray-100 text-gray-800";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        color,
      )}
    >
      {value}
    </span>
  );
};
