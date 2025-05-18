import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProjectsPublishProjects } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { DialogTrigger } from "@radix-ui/react-dialog";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
  projectId: string;
  isPublished: boolean;
  onToggleSuccess: () => Promise<void>;
  children: React.ReactNode;
}

export default function PublishProjectDialog({projectId, isPublished, onToggleSuccess, children}: IProps) {
  const { t } = useTranslation("projects");
  const [open, setOpen] = useState(false);

  const publishMutation = useProjectsPublishProjects({
    onSuccess: async () => {
      setOpen(false);
      toast(t("PublishSuccess"));
      await onToggleSuccess();
    },
    onError: (error) => useErrorToast(error),
  });

  const unpublishMutation = useProjectsPublishProjects({
    onSuccess: async () => {
      setOpen(false);
      toast(t("UnpublishSuccess"));
      await onToggleSuccess();
    },
    onError: (error) => useErrorToast(error),
  });

  const onSubmit = useCallback(() => {
    const mutation = isPublished ? unpublishMutation : publishMutation;
    mutation.mutate({
      body: {
        publish: !isPublished,
        projectIds: [projectId]
      }
    });
  }, [isPublished, projectId, publishMutation, unpublishMutation]);

  const title = isPublished ? t("Unpublish") : t("Publish");
  const confirmationText = isPublished ? t("UnpublishConfirmation") : t("PublishConfirmation");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ConfirmationDialogContent onConfirm={onSubmit} onClose={() => setOpen(false)} confirmationText={confirmationText}/>
      </DialogContent>
    </Dialog>
  );
};