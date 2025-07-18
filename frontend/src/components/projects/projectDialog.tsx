import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import sanitizeHtml from "sanitize-html";
import { BaseImgTag } from "../ui/BaseImgTag";
import { DialogHeader } from "../ui/dialog";
import { cn } from "@/lib/utils";
import { useNextcloudGetFiles, fetchNextcloudGetFile } from "@/endpoints/gubenComponents";
import { ProjectType } from "@/types/ProjectType";
import { Image, NextcloudImageCarousel } from "../Images/NextcloudImageCarousel";
import { useTranslation } from "react-i18next";

interface IProps {
  project: ProjectResponse;
  children: React.ReactNode;
  className?: string;
  school?: boolean;
  imageFilenames?: string[]; 
}

export default function ProjectDialog({ project, children, className, imageFilenames }: IProps) {
  const { t } = useTranslation(["projects", "dashboard"]);
  const directory = `${ProjectType[project.type]}/${project.id}/pdfs`;
  const imageDirectory = `${ProjectType[project.type]}/${project.id}/images`;

  const pdfsQuery = useNextcloudGetFiles({
    queryParams: { directory },
  });

  const downloadFile = async (fileName: string) => {
    try {
      const data = await fetchNextcloudGetFile({
        queryParams: {
          filename: `${ProjectType[project.type]}/${project.id}/pdfs/${fileName}`
        },
      });

      if (data instanceof Blob || data instanceof ArrayBuffer || typeof data === "string") {
        const blob = new Blob([data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Unexpected response data:", data);
        alert(t("dashboard:DownloadFailed"));
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert(t("dashboard:DownloadFailed"));
    }
  };

  const imageObjects: Image[] = (imageFilenames ?? []).map(filename => ({
    filename,
    directory: imageDirectory,
  }));

  return (
    <Dialog>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent className={cn(
        "bg-white rounded-lg text-lg",
        "flex flex-col gap-4 p-16",
        "min-w-[100svw] max-w-[100svw] min-h-[100svh] max-h-[100svh] md:min-w-[80svw] md:max-w-[80svw] md:min-h-[80svh] md:max-h-[80svh]"
      )}>
      <DialogHeader className="gap-4">
        <DialogTitle className="text-4xl">{project.title}</DialogTitle>

        {project.imageUrl && (
          <div className="flex flex-col max-w-[512px] rounded-lg overflow-hidden">
            <BaseImgTag
              className="w-full"
              alt={project.imageCaption ?? undefined}
              src={project.imageUrl}
            />
            {project.imageCredits && (
              <p className="text-sm py-1 px-2 bg-black text-white">
                © {project.imageCredits}
              </p>
            )}
          </div>
        )}

        {imageObjects?.length > 0 && (
          <NextcloudImageCarousel images={imageObjects} />
        )}
      </DialogHeader>

        {!isNullOrUndefinedOrWhiteSpace(project.description) &&
          <DialogDescription>
            <div className="text-neutral-800" dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description!) }} />
          </DialogDescription>
        }

        {!isNullOrUndefinedOrWhiteSpace(project.fullText) &&
          <div className="whitespace-pre-wrap flex flex-col gap-2 text-neutral-800" dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.fullText!) }} />
        }

        {pdfsQuery.isSuccess && pdfsQuery.data.length > 0 && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">{t("projects:AttachedPdfs")}</h3>
            <ul className="list-disc list-inside space-y-1">
              {pdfsQuery.data.map((fileName, i) => {
                const displayName = decodeURIComponent(fileName.split('/').pop() || fileName);

                return (
                  <li key={i}>
                    <button
                      onClick={() => downloadFile(fileName)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {displayName}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}        
      </DialogContent>
    </Dialog>
  )
}
