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
      <h1 className="text-4xl text-black">Alle projekte</h1>
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
        <div className="columns-5 gap-4">
          {data?.results.map(p => (
            <ProjectDialog project={p}>
              <div className="my-2 rounded-lg shadow-lg overflow-hidden group">
                {p.imageUrl &&
                  <div className="relative">
                    <img className="h-full w-full object-cover group-hover:bg-neutral-500" src={p.imageUrl} alt="" />
                    <div className="absolute top-0 left-0 w-full h-full group-hover:bg-gradient-to-tr from-[rgba(0,0,0,0.2)] to-transparent"></div>
                  </div>
                }

                <div className="text-white bg-neutral-800 p-4 flex gap-4">
                  <p className="text-lg text-left">{p.title}</p>
                  <ExternalLinkIcon  />
                </div>
              </div>
            </ProjectDialog>
          ))}
        </div>
      </PaginationContainer>
    </div>
  )
}
