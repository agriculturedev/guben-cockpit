import { useBookingStore } from "@/stores/bookingStore";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import BookingDivider from "./bookingDivider";
import BookingCard from "./bookingCard";

export default function BookingRoom() {
  const { t } = useTranslation("booking");

  const { title } = useParams({ from: '/booking/room/$title' });
  const bookings = useBookingStore(state => state.bookings);
  const booking = bookings.find(b => b.title === title);
  const rooms = booking?.bookings;

    if (!booking) {
    return (
      <div className="p-6 text-center text-gubenAccent font-semibold">
        {t("bookingComponent.notFound")}
      </div>
    );
  }
    return (
    <div>
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src={booking.imgUrl}
          className="w-full h-full object-cover absolute top-0 left-0" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 flex flex-col items-center justify-center bg-red-600/70">
          <div className="mt-1 text-gubenAccent-foreground font-bold italic text-6xl tracking-tight">
            {title}
          </div>
        </div>
      </div>
      <BookingDivider text={t("our_rooms")} />
      <div id="rooms">
        {rooms?.map((room, index) => (
          <BookingCard key={index} booking={room} />
        ))}
      </div>
    </div>
  )
}