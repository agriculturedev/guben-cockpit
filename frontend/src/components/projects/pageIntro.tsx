import { PageResponse } from "@/endpoints/gubenSchemas"
import PageIntroLink from "./pageIntro.link"
import PageIntroSkeleton from "./pageIntro.skeleton"

interface IProps {
  info?: PageResponse
}

export default function PageIntro(props: IProps) {
  return (
    <div className="flex flex-col gap-8">
      {!props.info
        ? <PageIntroSkeleton />
        : (
          <div className="flex flex-col gap-4">
            <h1 className="text-gubenAccent text-3xl">{props.info?.title}</h1>
            <p className="text-lg text-neutral-900">{props.info?.description}</p>
          </div>
        )
      }

      <div className="flex flex-col gap-4">
        <PageIntroLink
          to="https://www.guben.de/de/service-center-de/item/408-ansprechpartner"
          text={"Ansprechpartnerin oder -partner finden!"} //TODO: add translations for these
          newWindow
        />
        <PageIntroLink
          to="https://www.guben.de/de/service-center-de/item/267-satzungen"
          text={"Rechtliche Grundlagen und Dokumente"}
          newWindow
        />
        <PageIntroLink
          to="https://www.guben.de/de/service-center-de"
          text={"Alle Informationen rund um die Bürgerservices"}
          newWindow
        />
      </div>
    </div>
  )
}
