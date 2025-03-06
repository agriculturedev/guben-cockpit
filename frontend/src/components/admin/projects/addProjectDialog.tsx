import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {CreateProjectQuery, CreateProjectResponse, ProjectResponse} from "@/endpoints/gubenSchemas";
import {ReactNode, useState} from "react";
import {formDefaults, FormSchema} from "./projectDialog.formSchema";

import ProjectDialogForm from "./projectDialog.form";
import {useProjectsCreateProject} from "@/endpoints/gubenComponents";
import {useErrorToast} from "@/hooks/useErrorToast";
import {useTranslation} from "react-i18next";

interface IProps {
  children: ReactNode;
  onCreateSuccess: (data: CreateProjectResponse) => Promise<void>;
}

//TODO: move to compound component design to prevent prop drilling
export default function AddProjectDialog({children, ...props}: IProps) {
  const {t} = useTranslation("projects");
  const [isOpen, setOpen] = useState<boolean>(false);

  const {mutateAsync} = useProjectsCreateProject({
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
      body: mapFormToCreateProjectQuery(form)
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className={"bg-white px-4 py-8"}>
        <h1>{t("Add")}</h1>
        <ProjectDialogForm
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function mapFormToCreateProjectQuery(form: FormSchema): CreateProjectQuery {
  return {
    title: form.title,
    description: form.description,
    fullText: form.fullText,
    imageCaption: form.imageCaption,
    imageCredits: form.imageCredits,
    imageUrl: form.imageUrl,
    highlighted: form.highlighted
  }
}
