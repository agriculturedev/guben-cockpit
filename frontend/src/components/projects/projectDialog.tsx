import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProjectCard from "./projectCard";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import { BaseImgTag } from "../ui/BaseImgTag";
import { DialogHeader } from "../ui/dialog";
import sanitizeHtml from "sanitize-html";

interface IProps {
  project: ProjectResponse
}

export default function ProjectDialog({project}: IProps) {
  return (
    <Dialog>
      <DialogTrigger className="h-full w-full">
        <ProjectCard project={project} />
      </DialogTrigger>

      <DialogContent className="bg-white rounded-lg p-4 max-h-[70svh]">
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="text-gubenAccent text-lg">{project.title}</DialogTitle>

          {!isNullOrUndefinedOrWhiteSpace(project.imageUrl) &&
            <div className="flex flex-col gap-1">
              <BaseImgTag
                className="rounded-lg"
                alt={project.imageCaption ?? undefined}
                src={project.imageUrl!}
              />
              <p className="break-words max-w-full self-end text-sm pr-4 text-neutral-500">{project.imageCredits}</p>
            </div>
          }
        </DialogHeader>

        {!isNullOrUndefinedOrWhiteSpace(project.description) &&
          <DialogDescription>
            <div dangerouslySetInnerHTML={{__html: sanitizeHtml(project.description!)}} />
          </DialogDescription>
        }

        {!isNullOrUndefinedOrWhiteSpace(project.fullText) &&
          <div className="px-4 flex flex-col gap-4" dangerouslySetInnerHTML={{__html: sanitizeHtml(project.fullText!)}} />
        }
      </DialogContent>
    </Dialog>
  )
}
