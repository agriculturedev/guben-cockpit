import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProjectQuery, CreateProjectResponse } from "@/endpoints/gubenSchemas";
import { ReactNode, useState } from "react";
import { FormSchema } from "./projectDialog.formSchema";

import { useProjectsCreateProject } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import ProjectDialogForm from "./projectDialog.form";

interface IProps {
  children: ReactNode;
  onCreateSuccess: (data: CreateProjectResponse) => Promise<void>;
}

//TODO: move to compound component design to prevent prop drilling
export default function AddBusinessDialog({children, ...props}: IProps) {
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={"bg-white px-4 py-8 flex flex-col gap-2"}>
        <DialogHeader>
          <DialogTitle>{t("AddBusiness")}</DialogTitle>
        </DialogHeader>
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
    catName: "Gubener Marktplatz",
    title: form.title,
    description: form.description,
    fullText: form.fullText,
    imageCaption: form.imageCaption,
    imageCredits: form.imageCredits,
    imageUrl: form.imageUrl
  }
}
