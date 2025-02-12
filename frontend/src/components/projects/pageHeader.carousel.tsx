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
    <div className="relative h-[80%]">
      <ProjectDialog project={selectedProject}>
        <div className="rounded-xl overflow-hidden flex flex-col">
          <img className="object-cover" src={selectedProject.imageUrl ?? ""} />
          <div className="bg-neutral-900 text-white p-4 text-left text-xl flex gap-4">
            <p>{selectedProject.title}</p>
            <ExternalLinkIcon />
          </div>
        </div>
      </ProjectDialog>

      <div className="absolute top-4 right-4 flex w-min bg-[rgba(0,0,0,.8)] h-14 rounded-full px-4 justify-between items-center gap-8">
        <button className="group" onClick={onPrevious} disabled={selectedIndex == 0}>
          <ChevronLeft className="size-8 text-white group-hover:text-red-500 group-disabled:text-neutral-50" />
        </button>
        {/* NOTE: commented out, discuss if we want the dots or not in the design */}
        {/* <div className="flex items-center justify-center gap-4 w-50 flex-1">
          <div className={cn("size-1 bg-white rounded-full", selectedIndex < 3 ? "invisible" : "")}></div>
          <div className={cn("size-2 bg-white rounded-full", selectedIndex < 2 ? "invisible" : "")}></div>
          <div className={cn("size-3 bg-white rounded-full", selectedIndex < 1 ? "invisible" : "")}></div>
          <div className="size-4 bg-gubenAccent rounded-full"></div>
          <div className={cn("size-3 bg-white rounded-full", selectedIndex > projects.length - 2 ? "invisible" : "")}></div>
          <div className={cn("size-2 bg-white rounded-full", selectedIndex > projects.length - 3 ? "invisible" : "")}></div>
          <div className={cn("size-1 bg-white rounded-full", selectedIndex > projects.length - 4 ? "invisible" : "")}></div>
        </div> */}
        <button className="group" onClick={onNext} disabled={selectedIndex >= projects.length - 1}>
          <ChevronRight className="size-8 text-white group-hover:text-red-500 group-disabled:text-neutral-50" />
        </button>
      </div>
    </div>
  )
}
