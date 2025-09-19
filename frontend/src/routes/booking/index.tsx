import { createFileRoute } from '@tanstack/react-router'
import { HouseIcon, InfoIcon, TrophyIcon } from 'lucide-react'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { useBookingStore } from '@/stores/bookingStore'
import { useTranslation } from 'react-i18next'
import { useBookingGetAllTenantIds } from '@/endpoints/gubenComponents'

import BookingCard from '@/components/booking/bookingCard'
import BookingDivider from '@/components/booking/bookingDivider'
import BookingHeader from '@/components/booking/bookingHeader'
import BookingIntegration from '@/components/booking/bookingIntegration'
import BookingHowItWorks from '@/components/booking/bookingHowItWorks'
import BookingFaq from '@/components/booking/bookingFaq'
import i18next from 'i18next'
import { Language } from '@/utilities/i18n/Languages'
import { translateBatchedMultiple, translateHtmlBatchedMultiple } from '@/utilities/translateUtils'
import { Skeleton } from '@/components/ui/skeleton'

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

  const [translationsReady, setTranslationsReady] = useState(false);
  const currentLang = i18next.language as Language;

  useEffect(() => {
    if (!shouldShowIntegration && currentLang !== "de" && bookables.length > 0) {
      const translateAll = async () => {
        setTranslationsReady(false);
        const descriptions = bookables
          .map(b => b.description)
          .filter(desc => desc && desc.trim());

        if (descriptions.length > 0) {
          await translateHtmlBatchedMultiple([...new Set(descriptions)], currentLang);
        }

        const otherStringsToTranslate = [
          ...bookables
            .map(b => b.autoCommitNote)
            .filter((note): note is string => note != null && note.trim() !== ''),
            
          ...bookables
            .flatMap(b => b.flags || [])
            .filter((flag): flag is string => flag != null && flag.trim() !== '') 
        ];
        
        if (otherStringsToTranslate.length > 0) {
          await translateBatchedMultiple([...new Set(otherStringsToTranslate)], currentLang);
        }

        setTranslationsReady(true);
      };

      translateAll();
    } else {
      setTranslationsReady(true);
    }
  }, [currentLang, shouldShowIntegration]);

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
            {translationsReady
              ? rooms.map((room, index) => <BookingCard key={index} booking={room} />)
              : Array.from({ length: rooms.length }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-80 p-4"
                  />
              ))
            }
          </div>
        </div>
        <BookingDivider icon={TrophyIcon} text={t("sportFacilities")} />
        <div id="sport_facilities">
          <div className="flex flex-wrap">
            {translationsReady
              ? sports.map((bookable, index) => <BookingCard key={`sport-${index}`} booking={bookable} />)
              : Array.from({ length: sports.length }).map((_, i) => (
                  <Skeleton key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-80 p-4" />
                ))
            }
          </div>
        </div>
        <BookingDivider icon={InfoIcon} text={t("resources")} />
        <div id="resources">
          <div className="flex flex-wrap">
            {translationsReady
              ? resources.map((bookable, index) => <BookingCard key={`res-${index}`} booking={bookable} />)
              : Array.from({ length: resources.length }).map((_, i) => (
                  <Skeleton key={i} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-80 p-4" />
                ))
            }
          </div>
        </div>
        <BookingHowItWorks />
        <BookingFaq />
      </div>
    </main>
  )
}