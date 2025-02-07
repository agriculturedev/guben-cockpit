import { ProjectResponse } from "@/endpoints/gubenSchemas";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import ProjectCard from "./projectCard-rename";
import ProjectCardPlaceholder from "./projectCard.placeholder";

interface IProps {
  projects: ProjectResponse[];
}

export default function HighlightedProjects({ projects }: IProps) {
  if(projects.length == 0) return <ProjectCardPlaceholder />

  const [selectedIndex, setSelectedIndex] = useState(0);
  const onNext = () => setSelectedIndex(curr => Math.min(projects.length - 1, curr + 1));
  const onPrevious = () => setSelectedIndex(curr => Math.max(0, curr - 1));

  return (
    <div className={"flex flex-col items-center w-full h-full gap-4"}>
      <div className="h-[30svh] w-full">
        <ProjectCard project={projects[selectedIndex]} />
      </div>

      {/* TODO: @Kilian - move this to a Reuuable Carousel component */}
      <div className="flex justify-between gap-8 w-1/2">
        <button className="group" onClick={onPrevious} disabled={selectedIndex == 0}>
          <ChevronLeft className="size-8 group-hover:text-red-500 group-disabled:text-neutral-500" />
        </button>
        <div className="flex items-center justify-center gap-4 w-50 flex-1">
          <div className={cn("size-1 bg-neutral-500 rounded-full", selectedIndex < 3 ? "invisible" : "")}></div>
          <div className={cn("size-2 bg-neutral-500 rounded-full", selectedIndex < 2 ? "invisible" : "")}></div>
          <div className={cn("size-3 bg-neutral-500 rounded-full", selectedIndex < 1 ? "invisible" : "")}></div>
          <div className="size-4 bg-gubenAccent rounded-full"></div>
          <div className={cn("size-3 bg-neutral-500 rounded-full", selectedIndex > projects.length - 2 ? "invisible" : "")}></div>
          <div className={cn("size-2 bg-neutral-500 rounded-full", selectedIndex > projects.length - 3 ? "invisible" : "")}></div>
          <div className={cn("size-1 bg-neutral-500 rounded-full", selectedIndex > projects.length - 4 ? "invisible" : "")}></div>
        </div>
        <button className="group" onClick={onNext} disabled={selectedIndex >= projects.length - 1}>
          <ChevronRight className="size-8 group-hover:text-red-500 group-disabled:text-neutral-500" />
        </button>
      </div>
    </div>
  )
}
