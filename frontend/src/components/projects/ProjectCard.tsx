import {ProjectListResponseDataItem} from "@/endpoints/gubenProdSchemas";
import { Card, CardDescription, CardHeader, CardHeaderImage, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isNullOrUndefinedOrWhiteSpace } from "@/lib/stringUtils";

interface ProjectCardProps {
    project: ProjectListResponseDataItem;
}

export const ProjectCard = ({project}: ProjectCardProps) => {
    const hasImage = !isNullOrUndefinedOrWhiteSpace(project.attributes?.imageUrl);
    const hasDescription = !isNullOrUndefinedOrWhiteSpace(project.attributes?.description);

    return (
        <>
            <Card className={"mb-2"}>
                {hasImage && <CardHeaderImage src={project.attributes?.imageUrl} alt={project.attributes?.imageCaption}/>}
                <CardHeader>
                    <CardTitle>{project.attributes?.title}</CardTitle>
                    {hasDescription &&
                      <CardDescription>
                        <ScrollArea className="h-24 rounded">
                            {project.attributes?.description}
                        </ScrollArea>
                      </CardDescription>
                    }
                </CardHeader>
            </Card>
        </>
    )
}
