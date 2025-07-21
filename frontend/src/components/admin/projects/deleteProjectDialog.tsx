import { ConfirmationDialogContent } from "@/components/confirmationDialog/confirmationDialogContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProjectsDeleteProject } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { ProjectType } from "@/types/ProjectType";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
  projectId: string;
  type?: string;
  onDeleteSuccess: () => Promise<void>;
  children: React.ReactNode;
}

export default function DeleteProjectDialog({projectId, type, onDeleteSuccess, children}: IProps) {
  const {t} = useTranslation(["common", "projects"])
  const [open, setOpen] = useState(false);


  const mutation = useProjectsDeleteProject({
    onSuccess: async () => {
      setOpen(false);
      toast(t("projects:DeletedSuccess"));
      await onDeleteSuccess();
    },
    onError: (error) => useErrorToast(error)
  });

  const onSubmit = useCallback(() => mutation.mutate({
    pathParams: {
      id: projectId
    },
    queryParams: {
      type: type
    }
  }), [mutation, projectId]);

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
