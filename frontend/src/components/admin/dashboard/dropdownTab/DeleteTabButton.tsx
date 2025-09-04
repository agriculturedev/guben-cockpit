import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { useDashboardDelete } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/general/Tooltip";

interface DeleteTabButtonProps {
  tabId: string;
  refetch: () => Promise<any>;
}

export const DeleteTabButton = ({ tabId, refetch }: DeleteTabButtonProps) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const [open, setOpen] = useState(false);

  const mutation = useDashboardDelete({
    onSuccess: async () => {
      await refetch();
      setOpen(false);
    },
    onError: (error) => useErrorToast(error),
  });

  const onSubmit = useCallback(
    () =>
      mutation.mutate({
        pathParams: {
          id: tabId,
        },
      }),
    [mutation, tabId],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <CustomTooltip text="Delete">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={t("common:Delete")}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </CustomTooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Delete")}</DialogTitle>
        </DialogHeader>

        <ConfirmationDialogContent
          onConfirm={onSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};