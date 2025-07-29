import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProjectQuery, CreateProjectResponse } from "@/endpoints/gubenSchemas";
import { ReactNode, useState } from "react";
import { FormSchema } from "./projectDialog.formSchema";

import { useProjectsCreateProject, useNextcloudCreateFile } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import ProjectDialogForm from "./projectDialog.form";
import { ProjectType } from "@/types/ProjectType";
import { FileInput } from "@/components/inputs/FileInput";

interface IProps {
  children: ReactNode;
  onCreateSuccess: (data: CreateProjectResponse) => Promise<void>;
}

//TODO: move to compound component design to prevent prop drilling
export default function AddProjectDialog({children, ...props}: IProps) {
  const {t} = useTranslation("projects");
  const [isOpen, setOpen] = useState<boolean>(false);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const createFileMutation = useNextcloudCreateFile();

  const {mutateAsync} = useProjectsCreateProject({
    onSuccess: async (data) => {
      try {
        if (data?.id && data?.type?.name && (pdfFiles.length > 0 || images.length > 0)) {
          const allFiles = [
            ...pdfFiles.map(file => ({
              file,
              directory: `${data?.type?.name}/${data.id}/pdfs`
            })),
            ...images.map(file => ({
              file,
              directory: `${data?.type?.name}/${data.id}/images`
            }))
          ];

          for (const { file, directory } of allFiles) {
            const formData = new FormData();
            formData.append("file", file);

            await createFileMutation.mutateAsync({
              queryParams: {
                filename: file.name,
                directory
              },
              body: formData as any,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          }
        }
      } catch (error) {

      } finally {
        setPdfFiles([]);
        setImages([]);
        setIsUploading(false);
      }
      setOpen(false);
      await props.onCreateSuccess(data);
    },
    onError: (error) => {
      useErrorToast(error);
    }
  })

  const handleSubmit = async (form: FormSchema) => {
    setIsUploading(true);
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
          <DialogTitle>{t("Add")}</DialogTitle>
        </DialogHeader>
        <FileInput files={pdfFiles} setFiles={setPdfFiles} />
        <FileInput images={true} files={images} setFiles={setImages} />
        <ProjectDialogForm
          disabled={isUploading}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function mapFormToCreateProjectQuery(form: FormSchema): CreateProjectQuery {
  return {
    type: ProjectType.Stadtentwicklung,
    title: form.title,
    description: form.description,
    fullText: form.fullText,
    imageCaption: form.imageCaption,
    imageCredits: form.imageCredits,
    imageUrl: form.imageUrl
  }
}
