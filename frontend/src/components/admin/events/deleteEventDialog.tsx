import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEventsDeleteEvent } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CustomTooltip } from "@/components/general/Tooltip";

interface IProps {
  eventId: string;
  onDeleteSuccess: () => Promise<any>;
  children: React.ReactNode;
}

export default function DeleteEventDialog({eventId, onDeleteSuccess, children}: IProps) {
  const {t} = useTranslation(["common", "events"])
  const [open, setOpen] = useState(false);

  const mutation = useEventsDeleteEvent({
    onSuccess: async () => {
      setOpen(false);
      toast(t("events:DeletedSuccess"));
      await onDeleteSuccess();
    },
    onError: (error) => useErrorToast(error)
  });

  const onSubmit = useCallback(() => mutation.mutate({
    pathParams: {
      id: eventId
    }
  }), [mutation, eventId]);

  return (
  <Dialog open={open} onOpenChange={setOpen}>
    <CustomTooltip text={t("events:Delete")}>
      <DialogTrigger>{children}</DialogTrigger>
    </CustomTooltip>


    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("Delete")}</DialogTitle>
      </DialogHeader>

      <ConfirmationDialogContent onConfirm={onSubmit} onClose={() => setOpen(false)}/>
    </DialogContent>
  </Dialog>
  );
}
