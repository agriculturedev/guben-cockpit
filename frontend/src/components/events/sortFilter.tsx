import { SortDescIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export enum SortOption {
  NONE = "none",
  TITLE = "title",
  START_DATE = "startDate",
}

export enum SortOrder {
  ASC = "ascending",
  DESC = "descending"
}

type Props = {
  option?: SortOption,
  order?: SortOrder
  onChange: (options?: string, order?: string) => unknown;
}

export default function SortFilter({
  option = SortOption.NONE,
  order = SortOrder.ASC,
  onChange
}: Props) {
  const {t} = useTranslation("common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><SortDescIcon className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2">
        <DropdownMenuLabel>{t("Sorting.Option")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={option} onValueChange={v => onChange(v == "none" ? undefined : v, order)}>
          <DropdownMenuRadioItem value={SortOption.NONE}>({t("Sorting.None")})</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortOption.TITLE}>{t("Sorting.Title")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortOption.START_DATE}>{t("Sorting.Date")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuLabel>{t("Sorting.Order")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={order} onValueChange={v => onChange(option, v)}>
          <DropdownMenuRadioItem value={SortOrder.ASC}>{t("Sorting.Ascending")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SortOrder.DESC}>{t("Sorting.Descending")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
