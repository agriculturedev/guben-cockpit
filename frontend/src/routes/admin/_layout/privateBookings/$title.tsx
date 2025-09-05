import BookingComponent from '@/components/booking/bookingComponent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_layout/privateBookings/$title')({
  component: BookingInformation,
})

function BookingInformation() {
  return (
    <div>
      <BookingComponent isPrivate={true} />
    </div>
  )
}