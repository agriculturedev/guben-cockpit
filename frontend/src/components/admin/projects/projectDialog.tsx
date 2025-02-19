import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import ProjectDialogForm from "./projectDialog.form";
import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { useMemo } from "react";
import { formDefaults, FormSchema } from "./projectDialog.formSchema";

interface IProps {
  project?: ProjectResponse
  children: React.ReactNode;
}

//TODO: move to compound component design to prevent prop drilling
export default function ProjectDialog({children, ...props}: IProps) {
  const mappedForm: FormSchema | undefined = useMemo(() => {
    if(!props.project) return undefined;
    return {
      title: props.project.title,
      description: props.project.description ?? formDefaults.description,
      fullText: props.project.fullText ?? formDefaults.fullText,
      imageCaption: props.project.imageCaption ?? formDefaults.imageCaption,
      imageUrl: props.project.imageUrl ?? formDefaults.imageUrl,
      imageCredits: props.project.imageCredits ?? formDefaults.imageCredits
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent>
        <ProjectDialogForm
          defaultData={mappedForm}
          onSubmit={console.log}
        />
      </DialogContent>
    </Dialog>
  )
}
