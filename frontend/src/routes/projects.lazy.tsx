import PageHeader from '@/components/projects/pageHeader';
import { usePagesGet, useProjectsGetAll } from '@/endpoints/gubenComponents';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Pages } from './admin/_layout/pages';

export const Route = createLazyFileRoute('/projects')({
  component: Component,
})

function Component() {
  const { data: pageInfo } = usePagesGet({ pathParams: { id: Pages.Projects } });
  const { data: projectsResponse } = useProjectsGetAll({});

  const highlightedProjects = useMemo(() => {
    return projectsResponse?.projects.filter(p => p.highlighted)
  }, [projectsResponse]);

  return (
    <main className="p-8 bg-white h-full">
      <PageHeader info={pageInfo} projects={highlightedProjects} />
    </main>
  )
}
