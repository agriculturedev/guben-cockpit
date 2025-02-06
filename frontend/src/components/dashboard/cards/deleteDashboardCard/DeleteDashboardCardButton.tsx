import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { useDashboardCardDelete, useDashboardDelete } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { DeleteIconButton } from "@/components/iconButtons/DeleteIconButton";

interface DeleteDashboardCardButtonProps {
  dashboardTabId: string;
  cardId: string;

  refetch: () => Promise<any>;
}

export const DeleteDashboardCardButton = ({dashboardTabId, cardId, refetch}: DeleteDashboardCardButtonProps) => {
  const {t} = useTranslation(["dashboard"]);
  const [open, setOpen] = useState(false);

  const mutation = useDashboardCardDelete({
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  function onSubmit() {
    mutation.mutate({pathParams: {id: dashboardTabId, cardId: cardId}});
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DeleteIconButton tooltip={t("Cards.Delete")} dialogTrigger={true} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Cards.Delete")}</DialogTitle>
        </DialogHeader>

        <ConfirmationDialogContent onConfirm={onSubmit} onClose={() => setOpen(false)}/>
      </DialogContent>
    </Dialog>
  )
}
