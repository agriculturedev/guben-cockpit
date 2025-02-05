import {Input} from "@/components/ui/input"
import {UseTextFilterHook} from "@/hooks/filters/useTextFilter";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
  controller: UseTextFilterHook;
  className?: string;
}

export function TextFilter({controller, className}: Props) {
  const {t} = useTranslation(["common"]);

  return (
    <div className={cn("flex flex-col gap-2", className ?? "")}>
      <Label>{t("Search")}</Label>
      <Input
        type="text"
        placeholder={t("Search")}
        value={controller.filter ?? ""}
        onChange={(e) => controller.setFilter(e.target.value)}
      />
    </div>
  )
}
