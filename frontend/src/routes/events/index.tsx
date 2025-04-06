import CitizenInformationSystemBanner from '@/components/events/citizenInformationSystemBanner'
import EventCard from '@/components/events/eventCard'
import { useEventsGetAll } from '@/endpoints/gubenComponents'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useEventsGetAll({
    queryParams: {
      pageSize: 20,
    },
  })

  return (
    <main className="h-full bg-neutral-50 relative">
      <CitizenInformationSystemBanner />

      <section className='relative h-[50svh] overflow-hidden bg-neutral-900 p-8'>
        <h1 className='text-white text-7xl text-center'>Events in stadt guben</h1>
      </section>

      <section className="flex flex-col max-w-7xl mx-auto gap-4 p-4">
        {data?.results.map((r) => <EventCard key={r.id} event={r} />)}
      </section>
    </main>
  )
}
