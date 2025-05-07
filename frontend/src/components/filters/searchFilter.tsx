import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type Props = {
  value: string | null;
  onChange: (value: string | null) => unknown;
  className?: string;
}

export function SearchFilter({
  value,
  onChange,
  className
}: Props) {
  const {t} = useTranslation("common");

  return (
    <div className={cn("flex flex-col gap-2 flex-1", className ?? "")}>
      <Label>{t("Search")}</Label>
      <Input
        placeholder={t("Search")}
        value={value ?? undefined}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
