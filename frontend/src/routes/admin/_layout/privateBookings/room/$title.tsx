import BookingRoom from '@/components/booking/bookingRoom';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/privateBookings/room/$title')({
  component: BookingInformation,
});

function BookingInformation() {
  return (
    <BookingRoom isPrivate={true} />
  )
};
