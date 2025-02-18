import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { ChevronLeft, ChevronRight, ExternalLinkIcon } from "lucide-react";
import { useMemo, useState } from "react";
import ProjectDialog from "./projectDialog";

interface IProps {
  projects: ProjectResponse[];
}

export default function PageHeaderCarousel({ projects }: IProps) {
  if(projects.length == 0) return undefined;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedProject = useMemo(() => projects[selectedIndex], [projects, selectedIndex]);
  const onNext = () => setSelectedIndex(curr => Math.min(projects.length - 1, curr + 1));
  const onPrevious = () => setSelectedIndex(curr => Math.max(0, curr - 1));

  return (
    <div className="relative h-full flex items-center">
      <ProjectDialog project={selectedProject} className="w-full rounded-lg overflow-hidden flex flex-col">
        <img className="object-cover flex-1 w-full max-h-[648px]" src={selectedProject.imageUrl ?? ""} />
        <div className="bg-neutral-900 text-white p-4 text-left text-xl flex gap-4 w-full">
          <p>{selectedProject.title}</p>
          <ExternalLinkIcon />
        </div>
      </ProjectDialog>

      <div className="absolute bottom-4 left-1/2 translate-x-[-50%] flex w-min bg-[rgba(0,0,0,.8)] h-14 rounded-full px-4 justify-between items-center gap-8">
        <button className="group" onClick={onPrevious} disabled={selectedIndex == 0}>
          <ChevronLeft className="size-8 text-white group-hover:text-red-500 group-disabled:text-neutral-500" />
        </button>
        <button className="group" onClick={onNext} disabled={selectedIndex >= projects.length - 1}>
          <ChevronRight className="size-8 text-white group-hover:text-red-500 group-disabled:text-neutral-500" />
        </button>
      </div>
    </div>
  )
}
