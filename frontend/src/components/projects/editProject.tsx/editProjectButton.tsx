import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useProjectsUpdateProject } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { ProjectResponse, UpdateProjectQuery } from "@/endpoints/gubenSchemas";
import { EditIconButton } from "@/components/iconButtons/EditIconButton";
import { z } from "zod";
import { useDialogFormToggle } from "@/hooks/useDialogFormToggle";
import { useProjectFormSchema } from "@/components/projects/createProject/useProjectFormSchema";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { WithClassName } from "@/types/WithClassName";

interface EditProjectButtonProps extends WithClassName {
  project: ProjectResponse;
  refetch: () => Promise<any>;
}

export const EditProjectButton = ({project, refetch, className}: EditProjectButtonProps) => {
  const {t} = useTranslation(["projects"]);
  const [open, setOpen] = useState(false);

  const mutation = useProjectsUpdateProject({
    onSuccess: async () => {
      toggleDialog(false);
      await refetch();
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  const {formSchema, form} = useProjectFormSchema(project);
  const toggleDialog = useDialogFormToggle(form, setOpen);

  function onSubmit(values: z.infer<typeof formSchema>) {
    var updateQuery: UpdateProjectQuery = {
      id: project.id,
      title: values.title,
      description: values.description,
      fullText: values.fullText,
      imageUrl: values.imageUrl,
      imageCaption: values.imageCaption,
      imageCredits: values.imageCredits,
    }

    mutation.mutate({body: updateQuery, pathParams: {id: project.id}});
  }

  return (
    <Dialog open={open} onOpenChange={toggleDialog}>
      <EditIconButton tooltip={t("Edit")} dialogTrigger={true} className={className} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Edit")}</DialogTitle>
        </DialogHeader>

        <ProjectForm form={form} onSubmit={onSubmit}/>
      </DialogContent>
    </Dialog>
  )
}
