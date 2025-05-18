import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProjectResponse, ProjectResponse, UpdateProjectQuery } from "@/endpoints/gubenSchemas";
import { ReactNode, useState } from "react";
import { FormSchema } from "./editProjectDialog.formSchema";

import { useProjectsUpdateProject } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import EditProjectDialogForm from "./editProjectDialog.form";

interface IProps {
  children: ReactNode;
  project: ProjectResponse;
  onCreateSuccess: (data: CreateProjectResponse) => Promise<void>;
}

export default function EditProjectDialog({children, project, ...props}: IProps) {
  const {t} = useTranslation("projects");
  const [isOpen, setOpen] = useState<boolean>(false);

  const {mutateAsync} = useProjectsUpdateProject({
    onSuccess: async (data) => {
      setOpen(false);
      await props.onCreateSuccess(data);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  })

  const handleSubmit = async (form: FormSchema) => {
    await mutateAsync({
      pathParams: { id: project.id },
      body: mapFormToEditProjectQuery(form)
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className={"bg-white px-4 py-8 flex flex-col gap-2"}>
        <DialogHeader>
          <DialogTitle>{t("Edit")}</DialogTitle>
        </DialogHeader>
        <EditProjectDialogForm
          defaultData={mapProjectToForm(project)}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function mapProjectToForm(project: ProjectResponse): FormSchema {
  return {
    title: project.title,
    description: project.description ?? null,
    fullText: project.fullText ?? null,
    imageCaption: project.imageCaption ?? null,
    imageUrl: project.imageUrl ?? null,
    imageCredits: project.imageCredits ?? null,
    isBusiness: project.catName === "Gubener Marktplatz" ? true : false,
  }
}

function mapFormToEditProjectQuery(form: FormSchema): UpdateProjectQuery {
  return {
    catName: form.isBusiness ? "Gubener Marktplatz" : "Stadtentwicklung",
    title: form.title,
    description: form.description,
    fullText: form.fullText,
    imageCaption: form.imageCaption,
    imageCredits: form.imageCredits,
    imageUrl: form.imageUrl
  }
}
