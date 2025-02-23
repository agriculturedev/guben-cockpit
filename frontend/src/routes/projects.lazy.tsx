import PageBody from '@/components/projects/pageBody';
import PageHeader from '@/components/projects/pageHeader';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/projects')({
  component: Component,
})

function Component() {
  return (
    <main className="p-8">
      <PageHeader />
      <PageBody />
    </main>
  )
}
