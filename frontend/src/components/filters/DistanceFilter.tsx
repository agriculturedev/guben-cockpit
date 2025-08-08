import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Combobox } from "../ui/comboBox";

interface Props {
  value?: string;
  onChange: (distance?: string | null) => unknown;
  className?: string;
}

export const DistanceFilter = ({ value = "10", onChange, className }: Props) => {
  const { t } = useTranslation("common");

  const options = [
    { label: "1 km", value: "1" },
    { label: "5 km", value: "5" },
    { label: "10 km", value: "10" },
    { label: "20 km", value: "20" },
    { label: "30 km", value: "30" },
    { label: "40 km", value: "40" },
    { label: t("All"), value: "0" }
  ];

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Radius")}</Label>
      <Combobox
        options={options}
        value={value}
        onSelect={onChange}
        placeholder={t("Radius")}
      />
    </div>
  );
};