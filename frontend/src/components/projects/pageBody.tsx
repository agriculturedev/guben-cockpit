import { useProjectsGetAll } from "@/endpoints/gubenComponents"
import { usePagination } from "@/hooks/usePagination";
import { PaginationContainer } from "../DataDisplay/PaginationContainer";
import { ExternalLinkIcon } from "lucide-react";
import ProjectDialog from "./projectDialog";

export default function PageBody() {
  const pagination = usePagination();

  console.log(pagination.pageSize)
  const {data} = useProjectsGetAll({
    queryParams: {
      pageSize: pagination.pageSize,
      pageNumber: pagination.page
    }
  });



  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-5xl text-black">Alle projekte</h1>
      <PaginationContainer
        nextPage={pagination.nextPage}
        previousPage={pagination.previousPage}
        setPageIndex={pagination.setPageIndex}
        setPageSize={pagination.setPageSize}
        total={pagination.total}
        pageCount={pagination.pageCount}
        pageSize={pagination.pageSize}
        page={pagination.page}
      >
        <div className="grid gap-8 grid-cols-4">
          {data?.results.map(p => (
            <ProjectDialog project={p} className="h-fit">
              <div className="rounded-md overflow-hidden shadow-md shadow-[rgba(0,0,0,0.3)] flex flex-col">
                {p.imageUrl && <img className="object-cover" src={p.imageUrl} alt="" />}

                <div className="flex gap-2 p-2 bg-neutral-900 text-white">
                  <p>{p.title}</p>
                  <ExternalLinkIcon />
                </div>
              </div>
            </ProjectDialog>
          ))}
        </div>
      </PaginationContainer>
    </div>
  )
}
