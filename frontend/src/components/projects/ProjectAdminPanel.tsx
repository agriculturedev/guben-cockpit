import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { AddProjectDialogButton } from "@/components/projects/createProject/CreateProjectDialogButton";
import { PaginationContainer } from "@/components/DataDisplay/PaginationContainer";
import * as React from "react";
import { defaultPaginationProps, usePagination } from "@/hooks/usePagination";
import { useProjectsGetMyProjects } from "@/endpoints/gubenComponents";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useEffect } from "react";
import { EditProjectButton } from "@/components/projects/editProject.tsx/editProjectButton";

export const ProjectAdminPanel = () => {
  const {t} = useTranslation(["projects"]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-between items-center">
        <Label className={"text-xl"}>{t("MyProjects")}</Label>
        <AddProjectDialogButton />
      </div>

      <div>
        <ProjectList />
      </div>
    </div>
  )
}


const ProjectList = () => {
  const {
    page,
    pageCount,
    total,
    pageSize,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    setTotal,
    setPageCount
  } = usePagination();

  const { data: projectData, refetch } = useProjectsGetMyProjects({
    queryParams: {
      pageSize,
      pageNumber: page,
    }
  });

  useEffect(() => {
    setTotal(projectData?.totalCount ?? defaultPaginationProps.total);
    setPageCount(projectData?.pageCount ?? defaultPaginationProps.pageCount);
  }, [projectData]);

  return (
    <PaginationContainer
      nextPage={nextPage} previousPage={previousPage} setPageIndex={setPageIndex}
      setPageSize={setPageSize} total={total} pageCount={pageCount} pageSize={pageSize}
      page={page}
    >
      <div className={"grid grid-cols-4 gap-2"}>
        {projectData?.results &&
          projectData.results.map((project, index) =>
            <div className="relative w-full h-full">
              <ProjectCard key={index} project={project} />
              <EditProjectButton project={project} refetch={refetch} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md" />
            </div>
          )}
      </div>
    </PaginationContainer>
  );
}
