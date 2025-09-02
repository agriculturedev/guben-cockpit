import { useCallback, useState } from "react";

import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { DeleteIconButton } from "@/components/iconButtons/DeleteIconButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardDropdownDelete } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";

interface DeleteDropdownButtonProps {
  dropdownId: string;
  refetch: () => Promise<any>;
}

export const DeleteDropdownButton = ({
  dropdownId,
  refetch,
}: DeleteDropdownButtonProps) => {
  const [open, setOpen] = useState(false);

  const mutation = useDashboardDropdownDelete({
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
          id: dropdownId,
        },
      }),
    [mutation, dropdownId],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DeleteIconButton
        disabled={mutation.isPending}
        tooltip="Delete Dropdown"
        dialogTrigger={true}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Dropdown</DialogTitle>
        </DialogHeader>

        <ConfirmationDialogContent
          onConfirm={onSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
