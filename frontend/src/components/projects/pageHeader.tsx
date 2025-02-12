import { PageResponse, ProjectResponse } from "@/endpoints/gubenSchemas";
import PageHeaderLink from "./pageHeader.link";
import PageHeaderCarousel from "./pageHeader.carousel";

export default function PageHeader(props: { info?: PageResponse, projects?: ProjectResponse[] }) {
  return (
    <div className='w-full h-[70svh] rounded-xl relative overflow-hidden'>
      <img src="/images/stadt-guben.jpg" className='absolute left-0 top-0 w-full h-full object-cover' />
      <div className='pointer-events-none bg-gradient-to-r w-full h-full absolute left-0 top-0 from-black to-[rgba(0,0,0,0.4)]' />

      <div className='absolute left-0 top-1/2 translate-y-[-50%] w-full h-full p-16 grid grid-cols-2 gap-16 items-center justify-center'>
        <div className='flex flex-col gap-8 text-lg text-white'>
          <h1 className='white text-5xl'>{props.info?.title}</h1>
          <p className='text-xl'>
            {props.info?.description}
          </p>
          <div className='flex flex-col gap-4'>
            <PageHeaderLink
              to="https://www.guben.de/de/service-center-de/item/408-ansprechpartner"
              text={"Ansprechpartnerin oder -partner finden!"} //TODO: add translations for these
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
          </div>
        </div>

        {props.projects && <PageHeaderCarousel projects={props.projects} />}
      </div>

    </div>
  )
}
