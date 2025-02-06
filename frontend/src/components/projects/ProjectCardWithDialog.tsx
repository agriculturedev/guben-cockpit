import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";
import { BaseImgTag } from "@/components/ui/BaseImgTag";

interface Props {
  project: ProjectResponse;
}

export const ProjectCardWithDialog = ({project}: Props) => {
  const hasDescription = !isNullOrUndefinedOrWhiteSpace(project?.description);
  const hasFullText = !isNullOrUndefinedOrWhiteSpace(project?.fullText);

  return (
    <Dialog>
      <DialogTrigger>
        <ProjectCard project={project}/>
      </DialogTrigger>
      <DialogContent className="w-2/3 max-w-full max-h-[90dvh] overflow-auto">
        <DialogHeader className={"flex gap-1"}>
          <DialogTitle>{project?.title}</DialogTitle>
          {!isNullOrUndefinedOrWhiteSpace(project?.imageUrl) &&
            <div className={"rounded shadow-md relative self-center max-w-[70dvh] w-auto"}>
              <BaseImgTag className={"rounded"} alt={project.imageCaption ?? undefined} src={project.imageUrl!}/>
              <p
                className={"absolute rounded-tr rounded-bl p-1 left-0 bottom-0 shadow-md backdrop-blur-sm backdrop-brightness-110 text-black"}>{project?.imageCredits}</p>
            </div>}
          {hasDescription &&
            <DialogDescription>
              <div dangerouslySetInnerHTML={{__html: project.description!}}></div>
            </DialogDescription>
          }
        </DialogHeader>
        {hasFullText && <div dangerouslySetInnerHTML={{__html: project.fullText!}}></div>}
      </DialogContent>
    </Dialog>
  )
}
