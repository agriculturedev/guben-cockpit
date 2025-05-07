import BookingCard from '@/components/booking/bookingCard'
import BookingDivider from '@/components/booking/bookingDivider'
import BookingHeader from '@/components/booking/bookingHeader'
import BookingIntegration from '@/components/booking/bookingIntegration'
import { Skeleton } from '@/components/ui/skeleton'
import { createFileRoute } from '@tanstack/react-router'
import { HouseIcon, InfoIcon, TrophyIcon } from 'lucide-react'
import { useState } from 'react'
import BookingHowItWorks from '@/components/booking/bookingHowItWorks'
import BookingFaq from '@/components/booking/bookingFaq'
import { useBookingStore } from '@/stores/bookingStore'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/booking/')({
  component: Booking,
})

function Booking() {
  const { t } = useTranslation("booking");

  const [loading, setLoading] = useState(true)
  const bookables = useBookingStore((state) => state.bookings)

  const rooms = bookables.filter((b) => b.category === 'room')
  const resources = bookables.filter((b) => b.category === 'resource')
  const sports = bookables.filter((b) => b.category === 'sport')

  return (
    <main className="flex flex-col">
      <div>
        <BookingIntegration setLoading={setLoading} />
        <BookingHeader imgUrl="/images/guben-city-booking-placeholder.png" />
        <BookingDivider icon={HouseIcon} text={t("rooms")} />
        <div id="rooms">
          {loading ? (
            <Skeleton />
          ) : (
            <div className="flex flex-wrap">
              {rooms.map((room, index) => (
                <BookingCard key={index} booking={room} />
              ))}
            </div>
          )}
        </div>
        <BookingDivider icon={TrophyIcon} text={t("sportFacilities")} />
        <div id="sport_facilities">
          <div className="flex flex-wrap">
            {sports.map((bookable, index) => (
              <BookingCard key={`sport-${index}`} booking={bookable} />
            ))}
          </div>
        </div>
        <BookingDivider icon={InfoIcon} text={t("resources")} />
        <div id="resources">
          <div className="flex flex-wrap">
            {resources.map((bookable, index) => (
              <BookingCard key={`res-${index}`} booking={bookable} />
            ))}
          </div>
        </div>
        <BookingHowItWorks />
        <BookingFaq />
      </div>
    </main>
  )
}
