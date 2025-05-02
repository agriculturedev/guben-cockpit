import CitizenInformationSystemBanner from '@/components/events/citizenInformationSystemBanner'
import EventCard from '@/components/events/eventCard'
import EventsFilterSection from '@/components/events/eventFilters'
import { useEventsGetAll } from '@/endpoints/gubenComponents'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/events/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {t} = useTranslation("events")

  const { data } = useEventsGetAll({
    queryParams: {
      pageSize: 20,
    },
  })

  return (
    <main className="h-full bg-neutral-25 relative">
      <CitizenInformationSystemBanner />

      <section className='relative overflow-hidden p-8'>
        <h1 className='text-7xl text-center'>{t("PageTitle")}</h1>
        <div>
          <EventsFilterSection />
        </div>
      </section>

      <section className="flex flex-col max-w-7xl mx-auto gap-4 p-4">
        {data?.results.map(r => <EventCard key={r.id} event={r} />)}
      </section>
    </main>
  )
}
