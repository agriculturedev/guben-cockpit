import { useProjectsGetAllBusinesses } from "@/endpoints/gubenComponents"
import { usePagination } from "@/hooks/usePagination";
import { PaginationContainer } from "../DataDisplay/PaginationContainer";
import { useTranslation } from "react-i18next";
import ProjectCard from "./projectCard";

export default function PageBody() {
  const { t } = useTranslation('common');
  const pagination = usePagination();

  const { data } = useProjectsGetAllBusinesses({
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
          {data?.results.map(p => <ProjectCard project={p} />)}
        </div>
      </PaginationContainer>
    </section>
  )
}
