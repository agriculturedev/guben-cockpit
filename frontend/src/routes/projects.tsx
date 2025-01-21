import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useGetProjectView } from '@/endpoints/gubenProdComponents'
import { View } from "@/components/layout/View";
import { FeaturedProjectsList } from "@/components/projects/FeaturedProjects";
import { isNullOrUndefinedOrEmpty } from "@/lib/nullabilityUtils";
import { GenericButtonComponent } from "@/endpoints/gubenProdSchemas";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/projects')({
  component: ProjectsComponent,
})

function ProjectsComponent() {
  const { data: projectViewData, error: projectViewError, isLoading: projectViewIsLoading } = useGetProjectView({ queryParams: { populate: "projects,allProjects,InfoFromAdmin" } });


  return (
    <>
      <View title={projectViewData?.data?.attributes?.Title} description={projectViewData?.data?.attributes?.Description} isLoading={projectViewIsLoading}>
        {!isNullOrUndefinedOrEmpty(projectViewData?.data?.attributes?.projects?.data) &&
		      <FeaturedProjectsList projects={projectViewData!.data!.attributes!.projects!}/>
        }

        {!isNullOrUndefinedOrEmpty(projectViewData?.data?.attributes?.allProjects?.data) &&
          (<>
            <h1 className={"text-gubenAccent text-h1 font-bold"}>{"Gubener Marktpatz"}</h1>
            <FeaturedProjectsList projects={projectViewData!.data!.attributes!.allProjects!}/>
          </>)
        }

        <div className={"flex flex-col gap-6 items-center"}>
          <h1 className={"text-gubenAccent text-h1 font-bold"}>Hinweise von Ihrer Verwaltung</h1>
          <hr className={"border-red-500 w-full"}/>
          <div className={"flex justify-evenly w-full"}>
            {projectViewData?.data?.attributes?.InfoFromAdmin?.map((button: GenericButtonComponent, index: number) => (
              <a key={index} href={button.url}>
                <Button className={"bg-gubenAccent shadow"}>
                  <p className={"text-gubenAccent-foreground underline underline-offset-2"}>{button.text}</p>
                </Button>
              </a>
            ))}
          </div>
        </div>
      </View>
    </>
  );
}
