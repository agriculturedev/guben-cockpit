import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { useDashboardDelete } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { DeleteIconButton } from "@/components/iconButtons/DeleteIconButton";

interface DeleteDashboardTabButtonProps {
  dashboardTabId: string;

  refetch: () => Promise<any>;
}

export const DeleteDashboardTabButton = ({dashboardTabId, refetch}: DeleteDashboardTabButtonProps) => {
  const {t} = useTranslation(["dashboard"]);
  const [open, setOpen] = useState(false);

  const mutation = useDashboardDelete({
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  function onSubmit() {
    mutation.mutate({pathParams: {id: dashboardTabId}});
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DeleteIconButton tooltip={t("Delete")} dialogTrigger={true}/>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Delete")}</DialogTitle>
        </DialogHeader>

        <ConfirmationDialogContent onConfirm={onSubmit} onClose={() => setOpen(false)}/>
      </DialogContent>
    </Dialog>
  )
}
