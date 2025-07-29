import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProjectResponse, ProjectResponse, UpdateProjectQuery } from "@/endpoints/gubenSchemas";
import { ReactNode, useState, useEffect } from "react";
import { FormSchema } from "./editProjectDialog.formSchema";

import { useNextcloudDeleteFile, useNextcloudGetFiles, useProjectsUpdateProject } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useTranslation } from "react-i18next";
import EditProjectDialogForm from "./editProjectDialog.form";
import { ProjectType } from "@/types/ProjectType";
import { useNextcloudCreateFile } from "@/endpoints/gubenComponents";
import { FileInput } from "@/components/inputs/FileInput";
import { Button } from "@/components/ui/button";

interface IProps {
  children: ReactNode;
  project: ProjectResponse;
  onCreateSuccess: (data: CreateProjectResponse) => Promise<void>;
}

export default function EditProjectDialog({ children, project, ...props }: IProps) {
  const { t } = useTranslation("projects");
  const [isOpen, setOpen] = useState<boolean>(false);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const pdfsQuery = useNextcloudGetFiles({
    queryParams: {
      directory: `${ProjectType[project.type]}/${project.id}/pdfs`
    }
  });

  const imagesQuery = useNextcloudGetFiles({
    queryParams: {
      directory: `${ProjectType[project.type]}/${project.id}/images`
    }
  });

  const createFileMutation = useNextcloudCreateFile();

  const { mutateAsync } = useProjectsUpdateProject({
    onSuccess: async (data) => {
      try {
        if (project.id && project.type && (pdfFiles.length > 0 || images.length > 0)) {
          const allFiles = [
            ...pdfFiles.map(file => ({
              file,
              directory: `${ProjectType[project.type]}/${project.id}/pdfs`
            })),
            ...images.map(file => ({
              file,
              directory: `${ProjectType[project.type]}/${project.id}/images`
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
      pathParams: { id: project.id },
      body: mapFormToEditProjectQuery(form)
    });
  };

  const deleteFileMutation = useNextcloudDeleteFile();

  const handleRemoveFile = async (filename: string, type: "pdfs" | "images") => {
    const directory = `${ProjectType[project.type]}/${project.id}/${type}`;
    try {
      await deleteFileMutation.mutateAsync({
        queryParams: { filename, directory }
      });
      if (type === "pdfs") pdfsQuery.refetch();
      else imagesQuery.refetch();
    } catch (error: any) {
      useErrorToast(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className={"bg-white px-4 py-8 flex flex-col gap-2"}>
        <DialogHeader>
          <DialogTitle>{t("Edit")}</DialogTitle>
        </DialogHeader>
        {(pdfsQuery.data ?? []).length > 0 && (
          <div>
            {(pdfsQuery.data ?? []).map(file => (
              <div key={file} className="flex gap-2 items-center">
                <span>{file}</span>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveFile(file, "pdfs")}
                >
                  {t("Remove")}
                </Button>
              </div>
            ))}
          </div>
        )}
        <FileInput files={pdfFiles} setFiles={setPdfFiles} />
        {(imagesQuery.data ?? []).length > 0 && (
          <div>
            {(imagesQuery.data ?? []).map(file => (
              <div key={file} className="flex gap-2 items-center">
                <span>{file}</span>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveFile(file, "images")}
                >
                  {t("Remove")}
                </Button>
              </div>
            ))}
          </div>
        )}
        <FileInput images={true} files={images} setFiles={setImages} />
        <EditProjectDialogForm
          disabled={isUploading}
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
    isBusiness: project.type === ProjectType.GubenerMarktplatz,
    isSchool: project.type === ProjectType.Schule
  }
}

function mapFormToEditProjectQuery(form: FormSchema): UpdateProjectQuery {
  let type: ProjectType;

  if (form.isBusiness) {
    type = ProjectType.GubenerMarktplatz;
  } else if (form.isSchool) {
    type = ProjectType.Schule;
  } else {
    type = ProjectType.Stadtentwicklung;
  }

  return {
    type,
    title: form.title,
    description: form.description,
    fullText: form.fullText,
    imageCaption: form.imageCaption,
    imageCredits: form.imageCredits,
    imageUrl: form.imageUrl
  }
}
