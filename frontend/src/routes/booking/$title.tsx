import BookingComponent from '@/components/booking/bookingComponent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/booking/$title')({
  component: BookingInformation,
})

function BookingInformation() {
  return (
    <div>
      <BookingComponent />
    </div>
  )
}