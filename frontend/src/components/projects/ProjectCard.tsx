import { ProjectListResponseDataItem } from "@/endpoints/gubenProdSchemas";
import { Card, CardDescription, CardHeader, CardHeaderImage, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isNullOrUndefinedOrWhiteSpace } from "@/lib/stringUtils";
import { ProjectResponse } from "@/endpoints/gubenSchemas";

interface ProjectCardProps {
  project: ProjectListResponseDataItem;
}

export const ProjectCard = ({project}: ProjectCardProps) => {
  const hasImage = !isNullOrUndefinedOrWhiteSpace(project.attributes?.imageUrl);
  const hasDescription = !isNullOrUndefinedOrWhiteSpace(project.attributes?.description);

  return (
    <>
      <Card>
        {hasImage && <CardHeaderImage src={project.attributes?.imageUrl} alt={project.attributes?.imageCaption}/>}
        <CardHeader>
          <CardTitle>{project.attributes?.title}</CardTitle>
          {hasDescription &&
            <CardDescription>
              <ScrollArea className="h-24 rounded">
                <div dangerouslySetInnerHTML={{__html: project.attributes?.description!}}></div>
              </ScrollArea>
            </CardDescription>
          }
        </CardHeader>
      </Card>
    </>
  )
}


interface ProjectCardProps2 {
  project: ProjectResponse;
}

export const ProjectCard2 = ({project}: ProjectCardProps2) => {
  const hasImage = !isNullOrUndefinedOrWhiteSpace(project?.imageUrl);
  const hasDescription = !isNullOrUndefinedOrWhiteSpace(project?.description);

  return (
    <>
      <Card>
        {hasImage && <CardHeaderImage src={project?.imageUrl!} alt={project?.imageCaption ?? undefined}/>}
        <CardHeader>
          <CardTitle>{project?.title}</CardTitle>
          {hasDescription &&
            <CardDescription>
              <ScrollArea className="h-24 rounded">
                <div dangerouslySetInnerHTML={{__html: project.description!}}></div>
              </ScrollArea>
            </CardDescription>
          }
        </CardHeader>
      </Card>
    </>
  )
}
