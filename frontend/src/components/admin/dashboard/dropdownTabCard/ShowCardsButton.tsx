import { WalletCardsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";
import { InformationCardResponse } from "@/endpoints/gubenSchemas";

import { DropdownTabCardsList } from "./DropdownTabCardsList";
import { CreateDashboardCardButton } from "@/components/dashboard/cards/createDashboardCard/CreateDashboardCardButton";

interface ShowCardsButtonProps {
  tabId: string;
  informationCards: InformationCardResponse[];
  canEdit?: boolean;
  refetch?: () => Promise<any>;
}

export const ShowCardsButton = ({
  tabId,
  informationCards,
  canEdit,
  refetch,
}: ShowCardsButtonProps) => {
  const { t } = useTranslation("dashboard");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <CustomTooltip text={t("Cards.Cards")}>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
            <WalletCardsIcon className="w-4 h-4" />
          </Button>
        </CustomTooltip>
      </DialogTrigger>
      <DialogContent className="min-w-[30vw]">
        <DialogHeader className="mb-4 flex flex-row gap-2 items-center justify-start">
          <DialogTitle>{t("Cards.Cards")}</DialogTitle>
          {canEdit && (
            <CreateDashboardCardButton
              dashboardTabId={tabId}
              onSuccess={refetch}
            />
          )}
        </DialogHeader>

        <DropdownTabCardsList
          tabId={tabId}
          informationCards={informationCards}
          refetch={refetch}
          onSuccess={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
