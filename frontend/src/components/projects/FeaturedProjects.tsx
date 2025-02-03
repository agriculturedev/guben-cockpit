import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import {  ProjectCardWithDialog } from "@/components/projects/ProjectCardWithDialog";
import { ProjectResponse } from "@/endpoints/gubenSchemas";

interface FeaturedProjectsListProps {
  projects: ProjectResponse[];
}

export const FeaturedProjectsList = ({ projects }: FeaturedProjectsListProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full pb-2"
    >
      <CarouselContent>
        {projects && projects.map((project, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <ProjectCardWithDialog key={index} project={project}/>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext/>
    </Carousel>
  )
}

