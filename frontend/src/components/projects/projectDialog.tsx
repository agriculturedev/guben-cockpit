import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import sanitizeHtml from "sanitize-html";
import { BaseImgTag } from "../ui/BaseImgTag";
import { DialogHeader } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface IProps {
  project: ProjectResponse;
  children: React.ReactNode;
  className?: string;
}

export default function ProjectDialog({ project, children, className }: IProps) {
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

          <div className="flex flex-col max-w-[512px] rounded-lg overflow-hidden">
            <BaseImgTag className="w-full" alt={project.imageCaption ?? undefined} src={project.imageUrl!} />
            {project.imageCredits && <p className="text-sm py-1 px-2 bg-black text-white">© {project.imageCredits}</p>}
          </div>
        </DialogHeader>

        {!isNullOrUndefinedOrWhiteSpace(project.description) &&
          <DialogDescription>
            <div className="text-neutral-800" dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description!) }} />
          </DialogDescription>
        }

        {!isNullOrUndefinedOrWhiteSpace(project.fullText) &&
          <div className="whitespace-pre-wrap flex flex-col gap-2 text-neutral-800" dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.fullText!) }} />
        }
      </DialogContent>
    </Dialog>
  )
}
