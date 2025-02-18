import PageBody from '@/components/projects/pageBody';
import PageHeader from '@/components/projects/pageHeader';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/projects')({
  component: Component,
})

function Component() {
  return (
    <main className="p-8 bg-white h-full flex flex-col gap-12">
      <PageHeader />
      <PageBody />
    </main>
  )
}
