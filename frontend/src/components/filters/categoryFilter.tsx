import { Label } from "@/components/ui/label";
import { useCategoriesGetAll } from "@/endpoints/gubenComponents";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Combobox } from "../ui/comboBox";

interface CategoryFilterProps {
  value: string | null;
  onChange: (value: string | null) => unknown;
  className?: string;
  categories?: { id: string; name: string }[];
}

export const CategoryFilter = ({
  value,
  onChange,
  className,
  categories: customCategories = []
}: CategoryFilterProps) => {
  const { t } = useTranslation("common");
  const { data } = useCategoriesGetAll({});

  const backendCategories = data?.categories ?? [];
  const mergedCategories = Array.from(
    new Map([...backendCategories, ...customCategories].map(c => [c.name, c])).values()
  );

  const options = mergedCategories.map(c => ({
    label: c.name,
    value: c.name
  }));

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Category")}</Label>
      <Combobox
        options={options}
        value={value}
        onSelect={onChange}
        placeholder={t("Category")}
      />
    </div>
  );
}
