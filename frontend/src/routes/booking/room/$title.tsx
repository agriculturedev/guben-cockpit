
import BookingRoom from '@/components/booking/bookingRoom';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/booking/room/$title')({
  component: BookingInformation,
});

function BookingInformation() {
  return (
    <BookingRoom />
  )
};
