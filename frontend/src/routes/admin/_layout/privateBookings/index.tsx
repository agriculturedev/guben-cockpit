import BookingCard from '@/components/booking/bookingCard';
import BookingDivider from '@/components/booking/bookingDivider';
import BookingIntegration from '@/components/booking/bookingIntegration';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingGetPrivateTenantIds } from '@/endpoints/gubenComponents';
import { useBookingStore } from '@/stores/bookingStore';
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/admin/_layout/privateBookings/')({
  component: PrivateBookingPage,
});

function PrivateBookingPage() {
  const { t } = useTranslation("booking");
  const { data: tenantIds } = useBookingGetPrivateTenantIds({});
  const markProcessedTenants = useBookingStore((state) => state.markProcessedTenants);

  const bookables = useBookingStore((state) => state.bookings);

  const bookableObjects = useMemo(() => bookables.filter((b) => b.category === 'private'), [bookables]);

  const [loading, setLoading] = useState(bookables.length === 0);
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
      setLoading(false)
    }
  }, [currentTenantIndex, tenantIds?.tenants, markProcessedTenants]);

  return (
    <main className="felx flex-col">
      <div>
        { tenantIds && tenantIds.tenants.map((tenant) => (
          <BookingIntegration
            key={`${tenant.tenantId}`}
            tenantId={tenant.tenantId}
            privateTenant={true}
            setLoading={setLoading}
            onDone={handleTenantDone}
          />
        )) }

        <BookingDivider text={t('PrivateBookings')} />
        {loading ? (
          <Skeleton />
        ) : (
          <div id="private_bookings">
            <div className="flex flex-wrap">
              {bookableObjects.map((object, index) => (
                <BookingCard key={`object-${index}`} booking={object} isPrivate={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
