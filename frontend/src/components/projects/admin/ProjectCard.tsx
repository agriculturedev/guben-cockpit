import { Card, CardDescription, CardHeader, CardHeaderImage, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { isNullOrUndefinedOrWhiteSpace } from "@/utilities/nullabilityUtils";

interface ProjectCardProps {
  project: ProjectResponse;
}

export const ProjectCard = ({project}: ProjectCardProps) => {
  const hasImage = !isNullOrUndefinedOrWhiteSpace(project?.imageUrl);
  const hasDescription = !isNullOrUndefinedOrWhiteSpace(project?.description);

  return (
      <Card>
        {hasImage && <CardHeaderImage src={project?.imageUrl!} alt={project?.imageCaption ?? undefined}/>}
        <CardHeader className={"p-2 h-full"}>
          <CardTitle>{project?.title}</CardTitle>
          {hasDescription &&
            <CardDescription>
              <ScrollArea className="h-32 rounded">
                <div dangerouslySetInnerHTML={{__html: project.description!}}></div>
              </ScrollArea>
            </CardDescription>
          }
        </CardHeader>
      </Card>
  )
}
