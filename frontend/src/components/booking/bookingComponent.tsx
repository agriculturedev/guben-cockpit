import BookingDivider from "./bookingDivider";
import { useParams } from "@tanstack/react-router";
import { useBookingStore } from "@/stores/bookingStore";
import PriceCard from "./priceCard";
import { useTranslation } from "react-i18next";

export default function BookingComponent() {
  const { t } = useTranslation("booking");

  const { title } = useParams({ from: '/booking/$title' });
  const bookings = useBookingStore(state => state.bookings);
  const booking = bookings.find(b => b.title === title);

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
      <div>
        <BookingDivider text={title} />
        <div className="py-5 pl-5 grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <p style={{ whiteSpace: "pre-wrap"}}>{booking.description}</p>
          </div>
          <div className="col-span-1">
          {/* There will probably be some images added here at a later stage,
          so leaving this empty for now */}
        </div>
        </div>
        <BookingDivider text={t("bookingComponent.offer")} />
        <PriceCard bookingUrl={booking.bookingUrl} price={booking.price} title={title} flags={booking.flags} />
      </div>
    </div>
  )
}