import { LucideIcon } from "lucide-react";

interface BookingDividerProps {
  icon?: LucideIcon;
  text: string;
}

export default function BookingDivider({icon: Icon, text}: BookingDividerProps) {
  return (
    <div className="w-full flex flex-col mt-10">
      <div className="flex items-center justify-end font-bold mb-1 w-1/3 text-3xl">
        {Icon && (
          <Icon className="mr-1 size-7" />
         )}
        {text}
      </div>
    <hr className="border-2 border-gubenAccent w-1/3" />
  </div>
  );
}