import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2Icon } from "lucide-react";

import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDropdownLinkDelete } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { CustomTooltip } from "@/components/general/Tooltip";
import { Button } from "@/components/ui/button";

interface DeleteLinkButtonProps {
  linkId: string;
  refetch: () => Promise<any>;
}

export const DeleteLinkButton = ({
  linkId,
  refetch,
}: DeleteLinkButtonProps) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const [open, setOpen] = useState(false);

  const mutation = useDropdownLinkDelete({
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
          id: linkId,
        },
      }),
    [mutation, linkId],
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
          <DialogTitle>Delete link</DialogTitle>
        </DialogHeader>

        <ConfirmationDialogContent
          onConfirm={onSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
