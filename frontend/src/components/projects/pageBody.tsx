import { useProjectsGetAll } from "@/endpoints/gubenComponents"
import { usePagination } from "@/hooks/usePagination";
import { PaginationContainer } from "../DataDisplay/PaginationContainer";
import { ExternalLinkIcon } from "lucide-react";
import ProjectDialog from "./projectDialog";
import { useTranslation } from "react-i18next";

export default function PageBody() {
  const { t } = useTranslation('common');
  const pagination = usePagination();

  const { data } = useProjectsGetAll({
    queryParams: {
      pageSize: pagination.pageSize,
      pageNumber: pagination.page
    }
  });

  console.log(data?.results);

  return (
    <section className="mt-8 flex flex-col gap-4">
      <h1 className="text-4xl text-black">
        {t("Marktplatz")}
      </h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.results.map(p => (
            <ProjectDialog project={p}>
              <div className="relative h-full flex flex-col justify-between rounded-lg overflow-hidden group">
                {p.imageUrl &&
                  <>
                    <img src={p.imageUrl} className="object-cover w-full h-full" />
                    <div className="absolute left-0 top-0 z-10 w-full h-full hidden group-hover:block bg-[rgba(0,0,0,.4)]" />
                  </>
                }

                <div className="absolute bottom-0 left-0 w-full flex gap-2 items-center p-2 z-20 bg-neutral-800 text-white" >
                  <p className="text-left">{p.title}</p>
                </div>

                <ExternalLinkIcon className="absolute right-4 top-4 text-white z-20 group-hover:visible invisible size-sm" />
              </div>
            </ProjectDialog>
          ))}
        </div>
      </PaginationContainer>
    </section>
  )
}
