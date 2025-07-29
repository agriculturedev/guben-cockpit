import { useTranslation } from "react-i18next";
import ProjectCard from "./projectCard";
import { useProjectsGetSchools } from "@/endpoints/gubenComponents";

export default function PageSchools() {
  const { t } = useTranslation('common');

  const { data } = useProjectsGetSchools({});

  return (
    <section className="mt-8 flex flex-col gap-4">
      <h1 className="text-4xl text-black">
        {t("Schools")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
        {data?.projects.map(p => <ProjectCard project={p} school={true} />)}
      </div>
    </section>
  )
}