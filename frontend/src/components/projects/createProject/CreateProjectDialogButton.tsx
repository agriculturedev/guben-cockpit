import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { useState } from "react";
import { useProjectsCreateProject } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useProjectFormSchema } from "../useProjectFormSchema";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { CreateProjectQuery } from "@/endpoints/gubenSchemas";
import { AddIconButton } from "@/components/iconButtons/AddIconButton";
import { ProjectForm } from "@/components/projects/ProjectForm";


interface AddProjectDialogButtonProps {
  onProjectCreated?: (projectId: string) => void;
}

export const AddProjectDialogButton = ({onProjectCreated}: AddProjectDialogButtonProps) => {
  const {t} = useTranslation("projects");
  const [open, setOpen] = useState(false);

  const mutation = useProjectsCreateProject({
    onSuccess: async (response) => {
      toggleDialog(false);
      onProjectCreated && onProjectCreated(response.projectId);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  const {formSchema, form} = useProjectFormSchema();
  const toggleDialog = useDialogFormToggle(form, setOpen);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newProject: CreateProjectQuery = {
      title: values.title,
      description: values.description,
      fullText: values.fullText,
      imageCredits: values.imageCredits,
      imageUrl: values.imageUrl,
      imageCaption: values.imageCaption,
    };

    mutation.mutate({body: newProject});
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <AddIconButton tooltip={t("Add")} dialogTrigger={true}/>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Add")}</DialogTitle>
        </DialogHeader>
        <ProjectForm form={form} onSubmit={onSubmit}/>
      </DialogContent>
    </Dialog>
  )
}
