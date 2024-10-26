import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import { ProjectViewListResponse } from "@/endpoints/gubenProdSchemas";
import { ProjectCardWithDialog } from "@/components/projects/ProjectCardWithDialog";

interface FeaturedProjectsListProps {
  projects: ProjectViewListResponse;
}

export const FeaturedProjectsList = ({ projects }: FeaturedProjectsListProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {projects && projects && projects.data && projects.data.map((project, index) => (
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

