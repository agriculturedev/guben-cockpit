import { MapPinnedIcon } from "lucide-react";
import { CardHeaderImage, Card, CardHeader, CardContent } from "../ui/card";
import { Link } from "@tanstack/react-router";
import { Booking } from "@/stores/bookingStore";
import DOMPurify from "dompurify";

type BookingCardProps = {
  booking: Booking;
  isPrivate?: boolean;
};

export default function BookingCard({booking, isPrivate = false }: BookingCardProps) {
  const to = isPrivate
    ? (booking.bookings?.length ?? 0) > 0
      ? `/admin/privateBookings/room/${booking.title}`
      : `/admin/privateBookings/${booking.title}`
    : (booking.bookings?.length ?? 0) > 0
      ? `/booking/room/${booking.title}`
      : `/booking/${booking.title}`;

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <Link
        to={to}
        className="text-gubenAccent">
        <Card className="h-full transition-transform transform hover:scale-95 hover:shadow-xl cursor-pointer">
          <CardHeaderImage
            className="max-h-40 w-full object-cover"
            src={booking.imgUrl}
            alt="Some Alt Text" />
          <CardHeader className="flex flex-col font-bold text-2xl">{booking.title}</CardHeader>
          <CardContent className="flex flex-col">
            { booking.type !== "resource" && (
              <div>
                <hr className="mb-2"/>
                <div className="flex flex-row items-center text-base font-normal text-gubenAccent">
                  <MapPinnedIcon className="mr-2" />
                  {booking.location}
                </div>
              </div>
            )}
            <hr className="my-2" />
            <div
              className="prose line-clamp-3 mt-2 break-words max-w-full"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(booking.description) }} />
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}