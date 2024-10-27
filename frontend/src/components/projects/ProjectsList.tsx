import { ProjectListResponseDataItem } from "@/endpoints/gubenProdSchemas";
import { ProjectCardWithDialog } from "@/components/projects/ProjectCardWithDialog";

interface ProjectsListProps {
  projects?: ProjectListResponseDataItem[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    <div className={"columns-3"}>
      {projects &&
        projects.map((project, index) =>
          <ProjectCardWithDialog key={index} project={project}/>)
      }
    </div>
  )
}
