import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useGetProjectView } from '@/endpoints/gubenProdComponents'
import { View } from "@/components/layout/View";
import { FeaturedProjectsList, FeaturedProjectsList2 } from "@/components/projects/FeaturedProjects";
import { isNullOrUndefinedOrEmpty } from "@/utilities/nullabilityUtils";
import { useProjectsGetAll } from "@/endpoints/gubenComponents";

export const Route = createFileRoute('/projects')({
  component: ProjectsComponent,
})

function ProjectsComponent() {
  const { data: projectViewData, error: projectViewError, isLoading: projectViewIsLoading } = useGetProjectView({ queryParams: { populate: "projects,allProjects" } });

  const { data: projectData } = useProjectsGetAll({ });

  return (
    <>
      <View title={projectViewData?.data?.attributes?.Title} description={projectViewData?.data?.attributes?.Description} isLoading={projectViewIsLoading}>
        {!isNullOrUndefinedOrEmpty(projectViewData?.data?.attributes?.projects?.data) &&
		      <FeaturedProjectsList projects={projectViewData!.data!.attributes!.projects!}/>
        }

        {!isNullOrUndefinedOrEmpty(projectData?.projects) &&
          (<>
            <h1 className={"text-gubenAccent text-h1 font-bold"}>{"Gubener Marktpatz"}</h1>
            <FeaturedProjectsList2 projects={projectData?.projects!}/>
          </>)
        }
      </View>
    </>
  );
}
