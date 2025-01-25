import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProjectListResponseDataItem } from "@/endpoints/gubenProdSchemas";
import { ProjectCard, ProjectCard2 } from "@/components/projects/ProjectCard";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/stringUtils";
import { ProjectResponse } from "@/endpoints/gubenSchemas";

interface Props {
  project: ProjectListResponseDataItem;
}

export const ProjectCardWithDialog = ({project}: Props) => {
  const hasDescription = !isNullOrUndefinedOrWhiteSpace(project.attributes?.description);
  const hasFullText = !isNullOrUndefinedOrWhiteSpace(project.attributes?.fullText);

  return (
    <Dialog>
      <DialogTrigger>
        <ProjectCard project={project}/>
      </DialogTrigger>
      <DialogContent className="w-2/3 max-w-full max-h-[90dvh] overflow-auto">
        <DialogHeader className={"flex gap-1"}>
          <DialogTitle>{project.attributes?.title}</DialogTitle>
          {!isNullOrUndefinedOrWhiteSpace(project.attributes?.imageUrl) &&
            <div className={"rounded shadow-md relative self-center max-w-[70dvh] w-auto"}>
              <img className={"rounded"} alt={project.attributes?.imageCaption} src={project.attributes!.imageUrl}/>
              <p
                className={"absolute rounded-tr rounded-bl p-1 left-0 bottom-0 shadow-md backdrop-blur-sm backdrop-brightness-110 text-black"}>{project.attributes?.imageCredits}</p>
            </div>}
          {hasDescription &&
            <DialogDescription>
              <div dangerouslySetInnerHTML={{__html: project.attributes!.description!}}></div>
            </DialogDescription>
          }
        </DialogHeader>
        {hasFullText && <div dangerouslySetInnerHTML={{__html: project.attributes!.fullText!}}></div>}
      </DialogContent>
    </Dialog>
  )
}

interface Props2 {
  project: ProjectResponse;
}

export const ProjectCardWithDialog2 = ({project}: Props2) => {
  const hasDescription = !isNullOrUndefinedOrWhiteSpace(project?.description);
  const hasFullText = !isNullOrUndefinedOrWhiteSpace(project?.fullText);

  return (
    <Dialog>
      <DialogTrigger>
        <ProjectCard2 project={project}/>
      </DialogTrigger>
      <DialogContent className="w-2/3 max-w-full max-h-[90dvh] overflow-auto">
        <DialogHeader className={"flex gap-1"}>
          <DialogTitle>{project?.title}</DialogTitle>
          {!isNullOrUndefinedOrWhiteSpace(project?.imageUrl) &&
            <div className={"rounded shadow-md relative self-center max-w-[70dvh] w-auto"}>
              <img className={"rounded"} alt={project.imageCaption ?? undefined} src={project.imageUrl!}/>
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
