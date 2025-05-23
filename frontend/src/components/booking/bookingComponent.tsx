import BookingDivider from "./bookingDivider";
import { useParams } from "@tanstack/react-router";
import { useBookingStore } from "@/stores/bookingStore";
import PriceCard from "./priceCard";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

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
        <div className="p-5 grid grid-cols-3 gap-5">
          <div className="col-span-2">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(booking.description || "").replace(/\n/g, "<br>"),
                }} />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <img
              src={booking.imgUrl}
              alt={t("imageAlt")}
              className="w-full h-auto max-h-80 rounded-lg object-contain" />
          </div>
        </div>
        <BookingDivider text={t("bookingComponent.offer")} />
        {booking.tickets && booking.tickets.length > 0 ? (
          booking.tickets.map((ticket, index) => (
            <PriceCard
              key={ticket.bkid || index}
              bookingUrl={ticket.bookingUrl}
              description={ticket.description}
              price={ticket.price}
              title={ticket.title || title}
              flags={ticket.flags || booking.flags}
              location={ticket.location || booking.location}
              autoCommitNote={ticket.autoCommitNote || booking.autoCommitNote}
            />
          ))
        ) : (
          <PriceCard
            bookingUrl={booking.bookingUrl}
            price={booking.price}
            title={title}
            flags={booking.flags}
            location={booking.location}
            autoCommitNote={booking.autoCommitNote}
          />
        )}
      </div>
    </div>
  )
};