import { Label } from "@/components/ui/label";
import { useCategoriesGetAll } from "@/endpoints/gubenComponents";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Combobox } from "../ui/comboBox";

interface CategoryFilterProps {
  value: string | null;
  onChange: (value: string | null) => unknown;
  className?: string;
}

export const CategoryFilter = ({
  value,
  onChange,
  className
}: CategoryFilterProps) => {
  const { t } = useTranslation("common");
  const { data } = useCategoriesGetAll({});

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Category")}</Label>
      <Combobox
        options={data?.categories.map(c => ({ label: c.name, value: c.id })) ?? []}
        value={value}
        onSelect={onChange}
        placeholder={t("Category")}
      />
    </div>
  );
}
