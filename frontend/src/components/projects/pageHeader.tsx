import { usePagesGet, useProjectsGetAllNonBusinesses } from "@/endpoints/gubenComponents";
import PageHeaderLink from "./pageHeader.link";
import { Pages } from "@/routes/admin/_layout/pages";
import { useMemo, useState } from "react";
import ProjectDialog from "./projectDialog";
import { ChevronLeft, ChevronRight, ExternalLinkIcon } from "lucide-react";

export default function PageHeader() {
  const { data: pageInfo } = usePagesGet({ pathParams: { id: Pages.Projects } });
  const { data: projectsData } = useProjectsGetAllNonBusinesses({});
  const projects = useMemo(() => projectsData?.projects ?? [], [projectsData]);
  const imgLink = "/images/stadt-guben.jpg";

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedProject = useMemo(() => projects.at(selectedIndex), [projects, selectedIndex]);
  const onNext = () => setSelectedIndex(curr => Math.min(projects.length - 1, curr + 1));
  const onPrevious = () => setSelectedIndex(curr => Math.max(0, curr - 1));

  return (
    <div className="relative rounded-lg overflow-hidden">
      <img className="block absolute top-0 left-0 w-full h-full aspect-auto object-cover" src={imgLink} />
      <div className="block absolute left-0 top-0 w-full h-full bg-[rgba(0,0,0,0.7)]" />

      <div className="w-full grid grid-cols-12 p-8 gap-12">
        <div className="col-span-12 lg:col-span-6 flex flex-col h-full gap-8 text-white z-10">
          <h1 className="text-2xl" >{pageInfo?.title}</h1>
          <p className="text-md whitespace-pre-wrap" >{pageInfo?.description}</p>
          <div className="flex flex-col gap-2">
            <Links />
          </div>
        </div>

        <div className="my-auto relative lg:col-span-6 rounded-lg overflow-hidden hidden lg:flex h-min">
          {selectedProject &&
            <ProjectDialog project={selectedProject} className="w-full">
              <img className="w-full max-h-[448px] object-cover" src={selectedProject.imageUrl ?? ""} />
              <div className="bg-neutral-900 text-white p-4 text-left text-xl flex gap-4 w-full">
                <p>{selectedProject.title}</p>
                <ExternalLinkIcon />
              </div>
            </ProjectDialog>
          }

          <div className="absolute top-2 right-2 flex bg-[rgba(0,0,0,.5)] h-min rounded-full px-4 py-2 justify-between items-center gap-8">
            <button className="group" onClick={onPrevious} disabled={selectedIndex == 0}>
              <ChevronLeft className="size-8 text-white group-hover:text-red-500 group-disabled:text-neutral-500" />
            </button>

            <button className="group" onClick={onNext} disabled={selectedIndex >= projects.length - 1}>
              <ChevronRight className="size-8 text-white group-hover:text-red-500 group-disabled:text-neutral-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Links() {
  return (
    <>
      <PageHeaderLink
        to="https://www.guben.de/de/service-center-de/item/408-ansprechpartner"
        text={"Ansprechpartnerin oder -partner finden!"}
        newWindow
      />
      <PageHeaderLink
        to="https://www.guben.de/de/service-center-de/item/267-satzungen"
        text={"Rechtliche Grundlagen und Dokumente"}
        newWindow
      />
      <PageHeaderLink
        to="https://www.guben.de/de/service-center-de"
        text={"Alle Informationen rund um die Bürgerservices"}
        newWindow
      />
    </>
  )
}
