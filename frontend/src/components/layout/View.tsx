import { ReactNode } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import Markdown from "react-markdown";
import { usePagesGet } from "@/endpoints/gubenComponents";
import { useErrorToast } from "@/hooks/useErrorToast";

interface Props {
  pageKey?: string;
  children?: ReactNode;
}

interface ViewHeaderProps {
  pageKey: string;
}

const ViewHeader = ({pageKey}: ViewHeaderProps) => {
  const {data: homePage, isFetching, error} = usePagesGet({
    pathParams: {id: pageKey ?? ""}
  })

  if (error) {
    useErrorToast(error);
  }

  return (
    isFetching ? (
      <div className={"flex flex-col gap-2"}>
        <Skeleton className="w-64 h-5 rounded-full"/>
        <Skeleton className="w-64 h-7 rounded-full"/>
      </div>
    ) : (
      <div className={"flex gap-3 flex-col"}>
        {homePage?.title && <h1 className={"text-gubenAccent text-h1 font-bold"}>{homePage.title}</h1>}
        {homePage?.description && <Markdown>{homePage.description}</Markdown>}
      </div>
    ))
}

export const View = ({children, pageKey}: Props) => {
  return (
    <main className={"w-full h-full flex flex-1 pl-20 pt-5 pr-20 pb-4 flex-col items-center"}>
      {pageKey &&
        <article className={"max-w-[1600px] pb-5"}>
          <ViewHeader pageKey={pageKey}/>
        </article>
      }
      <section className={"max-w-[1600px] w-full"}>
        {children}
      </section>
    </main>
  );
}
