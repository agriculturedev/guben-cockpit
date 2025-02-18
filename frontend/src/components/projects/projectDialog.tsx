import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import sanitizeHtml from "sanitize-html";
import { BaseImgTag } from "../ui/BaseImgTag";
import { DialogHeader } from "../ui/dialog";

interface IProps {
  project: ProjectResponse;
  children: React.ReactNode;
  className?: string;
}

export default function ProjectDialog({project, children, className}: IProps) {
  return (
    <Dialog>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent className="bg-white rounded-lg p-4 min-h-[30svh] min-w-[30svw] max-h-[70svh] max-w-[50svw] h-min w-min flex flex-col text-lg gap-4 px-14">
        <DialogHeader className="w-full gap-4">
          <DialogTitle className="text-4xl">{project.title}</DialogTitle>

          <div className="flex flex-col">
            <BaseImgTag className="w-full rounded-t-lg" alt={project.imageCaption ?? undefined} src={project.imageUrl!}/>
            <p className="text-sm py-2 px-4 rounded-b-lg bg-neutral-700 text-white">{project.imageCredits}</p>
          </div>
        </DialogHeader>

        {!isNullOrUndefinedOrWhiteSpace(project.description) &&
          <DialogDescription>
            <div className="text-neutral-800" dangerouslySetInnerHTML={{__html: sanitizeHtml(project.description!)}} />
          </DialogDescription>
        }

        {!isNullOrUndefinedOrWhiteSpace(project.fullText) &&
          <div className="px-4 flex flex-col gap-4 text-neutral-800" dangerouslySetInnerHTML={{__html: sanitizeHtml(project.fullText!)}} />
        }
      </DialogContent>
    </Dialog>
  )
}
