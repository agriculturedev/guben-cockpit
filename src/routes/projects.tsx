import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useGetProjectView } from '@/endpoints/gubenProdComponents'
import { View } from "@/components/layout/View";
import { FeaturedProjectsList } from "@/components/projects/FeaturedProjects";
import { isNullOrUndefinedOrEmpty } from "@/lib/nullabilityUtils";

export const Route = createFileRoute('/projects')({
  component: ProjectsComponent,
})

function ProjectsComponent() {
  const { data: projectViewData, error: projectViewError, isLoading: projectViewIsLoading } = useGetProjectView({ queryParams: { populate: "projects,allProjects" } });

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
      </View>
    </>
  );
}
