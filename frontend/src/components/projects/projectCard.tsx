import {ProjectResponse} from "@/endpoints/gubenSchemas";
import {ExternalLinkIcon} from "lucide-react";
import ProjectDialog from "@/components/projects/projectDialog";
import { useNextcloudGetFile, useNextcloudGetFiles } from "@/endpoints/gubenComponents";
import { ProjectType } from "@/types/ProjectType";

interface IProps {
  project: ProjectResponse;
  school?: boolean;
}

export default function ProjectCard({project, school}: IProps){
  const imagesQuery = useNextcloudGetFiles({
    queryParams: {
      directory: `${ProjectType[project.type]}/${project.id}/images`,
      },
    },
    { enabled: !!school });

  const imageFilename = (imagesQuery.data ?? [])[0];
  const filenamesAsStrings = imagesQuery.data;
  const image = useNextcloudGetFile({
    queryParams: {
      filename: `${ProjectType[project.type]}/${project.id}/images/${imageFilename}`
    }
  }, {
    enabled: !!imageFilename
  });

  const imageUrl = image.data ? URL.createObjectURL(image.data as Blob) : undefined;
  const imageUrlToUse = school && imageUrl ? imageUrl : project.imageUrl;

  return (
    <ProjectDialog project={project} school={school} imageFilenames={filenamesAsStrings}>
      <div className={"flex flex-col h-40 rounded-md overflow-hidden bg-neutral-800 text-white group"}>
        {imageUrlToUse && (
          <div className={"h-3/4"}>
            {}
            <img
              className={"object-cover object-center h-full w-full"}
              src={imageUrlToUse}
              alt={"image"}
            />
          </div>
        )}
        <div className={"h-1/4 mt-auto flex justify-between px-2 py-0 items-center text-sm"}>
          <p>{project.title}</p>
          <ExternalLinkIcon className="group-hover:visible invisible size-4" />
        </div>
      </div>
    </ProjectDialog>
  )
}
