import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFooterDeleteItem, useProjectsDeleteProject } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
  footerItemId: string;
  onDeleteSuccess: () => Promise<any>;
  children: React.ReactNode;
}

export default function DeleteFooterItemDialog({footerItemId, onDeleteSuccess, children}: IProps) {
  const {t} = useTranslation(["common", "footer"])
  const [open, setOpen] = useState(false);

  const mutation = useFooterDeleteItem({
    onSuccess: async () => {
      setOpen(false);
      toast(t("footer:DeletedSuccess"));
      await onDeleteSuccess();
    },
    onError: (error) => useErrorToast(error)
  });

  const onSubmit = useCallback(() => mutation.mutate({
    pathParams: {
      id: footerItemId
    }
  }), [mutation, footerItemId]);

  return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger>{children}</DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("Delete")}</DialogTitle>
      </DialogHeader>

      <ConfirmationDialogContent onConfirm={onSubmit} onClose={() => setOpen(false)}/>
    </DialogContent>
  </Dialog>
  );
}
