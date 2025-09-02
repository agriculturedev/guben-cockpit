import { createFileRoute } from '@tanstack/react-router'
import { HouseIcon, InfoIcon, TrophyIcon } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'
import { useBookingStore } from '@/stores/bookingStore'
import { useTranslation } from 'react-i18next'
import { useBookingGetAllTenantIds } from '@/endpoints/gubenComponents'

import BookingCard from '@/components/booking/bookingCard'
import BookingDivider from '@/components/booking/bookingDivider'
import BookingHeader from '@/components/booking/bookingHeader'
import BookingIntegration from '@/components/booking/bookingIntegration'
import BookingHowItWorks from '@/components/booking/bookingHowItWorks'
import BookingFaq from '@/components/booking/bookingFaq'

export const Route = createFileRoute('/booking/')({
  component: Booking,
})

function Booking() {
  const { t } = useTranslation("booking");

  const [loading, setLoading] = useState(true)
  const bookables = useBookingStore((state) => state.bookings)
  const processedTenants = useBookingStore((state) => state.processedTenants);
  const markProcessedTenants = useBookingStore((state) => state.markProcessedTenants);

  const rooms = useMemo(() => bookables.filter((b) => b.category === 'room'), [bookables])
  const resources = useMemo(() => bookables.filter((b) => b.category === 'resource'), [bookables])
  const sports = useMemo(() => bookables.filter((b) => b.category === 'sport'), [bookables])

  const { data: tenantIds } = useBookingGetAllTenantIds({});

  const [currentTenantIndex, setCurrentTenantIndex] = useState(0);

  const handleTenantDone = useCallback(() => {
    const currentTenant = tenantIds?.tenants[currentTenantIndex];
    if (currentTenant) {
      markProcessedTenants(currentTenant.tenantId);
    }

    const hasMoreTenants = currentTenantIndex < (tenantIds?.tenants?.length ?? 0) - 1;
    if (hasMoreTenants) {
      setCurrentTenantIndex(i => i + 1);
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [currentTenantIndex, tenantIds?.tenants, markProcessedTenants]);

  const currentTenant = tenantIds?.tenants[currentTenantIndex];
  const shouldShowIntegration = currentTenant && !processedTenants.has(currentTenant.tenantId);


  return (
    <main className="flex flex-col">
      <div>
        {shouldShowIntegration && (
          <BookingIntegration
            key={`${currentTenant.tenantId}`}
            tenantId={currentTenant.tenantId}
            setLoading={setLoading}
            onDone={handleTenantDone}
          />
        )}
        <BookingHeader imgUrl="/images/guben-city-booking-placeholder.png" />
        <BookingDivider icon={HouseIcon} text={t("rooms")} />
        <div id="rooms">
          <div className="flex flex-wrap">
            {rooms.map((room, index) => (
              <BookingCard key={index} booking={room} />
              ))}
          </div>
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