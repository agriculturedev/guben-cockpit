import { usePagesGet, useProjectsGetAll } from "@/endpoints/gubenComponents";
import { createFileRoute } from '@tanstack/react-router';
import { Pages } from "./admin/_layout/pages";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute('/projects')({
  component: ProjectsComponent,
})

function ProjectsComponent() {
  const { data: pageData } = usePagesGet({ pathParams: { id: Pages.Projects } });
  const { data: projectsReponse } = useProjectsGetAll({});

  return (
    <main className="w-full h-full flex justify-center items-center p-8">
      <div className="max-w-screen-2xl flex gap-10 items-center">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-gubenAccent text-2xl">{pageData?.title}</h1>
            <p className="text-neutral-900">{pageData?.description}</p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              target="_blank"
              className="text-gubenAccent underline visited:text-red-800"
              href="https://www.guben.de/de/service-center-de/item/408-ansprechpartner"
            >
              Ansprechpartnerin oder -partner finden!
            </a>
            <a
              target="_blank"
              className="text-gubenAccent underline visited:text-red-800"
              href="https://www.guben.de/de/service-center-de/item/267-satzungen"
            >
              Rechtliche Grundlagen und Dokumente
            </a>
            <a
              target="_blank"
              className="text-gubenAccent underline visited:text-red-800"
              href="https://www.guben.de/de/service-center-de"
            >
              Alle Informationen rund um die Bürgerservices
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center w-full h-full gap-4">
          <div className="relative rounded-xl overflow-hidden">
            <img src="https://images.pexels.com/photos/30536630/pexels-photo-30536630/free-photo-of-scenic-winter-view-of-lofoten-houses.jpeg" alt="image" />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-65 p-4">
              <p className="text-white text-xl">This is a title</p>
            </div>
          </div>
          <div className="flex gap-8">
            <button className="group">
              <ChevronLeft className="size-8 group-hover:text-red-500"/>
            </button>
            <div className="flex items-center gap-4">
              <div className="size-1 bg-neutral-500 rounded-full"></div>
              <div className="size-2 bg-neutral-500 rounded-full"></div>
              <div className="size-3 bg-neutral-500 rounded-full"></div>
              <div className="size-4 bg-gubenAccent rounded-full"></div>
              <div className="size-3 bg-neutral-500 rounded-full"></div>
              <div className="size-2 bg-neutral-500 rounded-full"></div>
              <div className="size-1 bg-neutral-500 rounded-full"></div>
            </div>
            <button className="group">
              <ChevronRight className="size-8 group-hover:text-red-500"/>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
