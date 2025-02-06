import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { View } from "@/components/layout/View";
import { useProjectsGetAll } from "@/endpoints/gubenComponents";
import { isNullOrUndefinedOrEmpty } from '@/utilities/nullabilityUtils';
import { FeaturedProjectsList } from "@/components/projects/FeaturedProjects";
import { Button } from "@/components/ui/button";
import { Pages } from "@/routes/admin/_layout/pages";

export const Route = createFileRoute('/projects')({
  component: ProjectsComponent,
})

function ProjectsComponent() {
  const { data: projectData } = useProjectsGetAll({ });

  const highlightedProjects = projectData?.projects.filter(p => p.highlighted)

  return (
    <>
      <View pageKey={Pages.Projects}>
        {highlightedProjects &&
		      <FeaturedProjectsList projects={highlightedProjects}/>
        }

        {!isNullOrUndefinedOrEmpty(projectData?.projects) &&
          (<>
            <h1 className={"text-gubenAccent text-h1 font-bold"}>{"Gubener Marktpatz"}</h1>
            <FeaturedProjectsList projects={projectData?.projects!}/>
          </>)
        }

        <div className={"flex flex-col gap-6 items-center"}>
          <h1 className={"text-gubenAccent text-h1 font-bold"}>Hinweise von Ihrer Verwaltung</h1>
          <hr className={"border-red-500 w-full"}/>
          <div className={"flex justify-evenly w-full"}>

            <a key={0} href="https://www.guben.de/de/service-center-de/item/408-ansprechpartner">
              <Button className={"bg-gubenAccent shadow"}>
                <p className={"text-gubenAccent-foreground underline underline-offset-2"}>Ansprechpartnerin oder -partner finden!</p>
              </Button>
            </a>

            <a key={1} href="https://www.guben.de/de/service-center-de/item/267-satzungen">
              <Button className={"bg-gubenAccent shadow"}>
                <p className={"text-gubenAccent-foreground underline underline-offset-2"}>Rechtliche Grundlagen und Dokumente</p>
              </Button>
            </a>

            <a key={2} href="https://www.guben.de/de/service-center-de">
              <Button className={"bg-gubenAccent shadow"}>
                <p className={"text-gubenAccent-foreground underline underline-offset-2"}>Alle Informationen rund um die Bürgerservices.</p>
              </Button>
            </a>

          </div>
        </div>
      </View>
    </>
  );
}
