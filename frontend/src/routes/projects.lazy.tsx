import { usePagesGet, useProjectsGetAll } from '@/endpoints/gubenComponents'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Pages } from './admin/_layout/pages'
import PageIntro from '@/components/projects/pageIntro';
import HighlightedProjects from '@/components/projects/highlightedProjects';

export const Route = createLazyFileRoute('/projects')({
  component: Component,
})

function Component() {
  const { data: pageInfo } = usePagesGet({ pathParams: { id: Pages.Projects } });
  const { data: projectsResponse } = useProjectsGetAll({});

  return (
    <main className="w-full h-full flex justify-center items-center p-8">
      <div className="max-w-screen-2xl flex gap-10 items-center">
        <div className='flex-1'>
          <PageIntro info={pageInfo} />
        </div>
        <div className='flex-1'>
          <HighlightedProjects projects={projectsResponse?.projects ?? []} />
        </div>
      </div>
    </main>
  )
}
