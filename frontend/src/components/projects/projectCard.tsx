import { ProjectResponse } from "@/endpoints/gubenSchemas";

interface IProps {
  project: ProjectResponse;
}

export default function ProjectCard(props: IProps) {
  return (
    <div className="relative h-full w-full flex justify-center items-center rounded-xl overflow-hidden">
      <img className="h-full w-auto rounded-lg" src={props.project.imageUrl ?? ""} alt={props.project.imageCaption ?? ""} />
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 p-4">
        <p className="text-white text-xl">{props.project.title}</p>
      </div>
    </div>
  )
}
