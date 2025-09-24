import PageBody from '@/components/projects/pageBody';
import PageHeader from '@/components/projects/pageHeader';
import PageSchools from '@/components/projects/pageSchools';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/projects')({
  component: Component,
})

function Component() {
  return (
    <main className="p-6 flex flex-col items-center bg-white h-full">
      <div className={"max-w-[120rem]"}>
        <PageHeader />
        <PageSchools />
        <PageBody />
      </div>
    </main>
  )
}
