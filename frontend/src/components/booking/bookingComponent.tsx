import BookingDivider from "./bookingDivider";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useBookingStore } from "@/stores/bookingStore";
import PriceCard from "./priceCard";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { TranslatedHtml } from "@/utilities/translateUtils";

type IProps = {
  isPrivate?: boolean;
}

export default function BookingComponent({ isPrivate = false }: IProps) {
  const { t } = useTranslation("booking");

  const navigate = useNavigate();
  const { title } = useParams({ from:
    isPrivate
     ? '/admin/_layout/privateBookings/$title'
     : '/booking/$title' });
  const bookings = useBookingStore(state => state.bookings);
  let booking = bookings.find(b => b.title === title) || bookings.flatMap(b => b.bookings || []).find(b => b.title === title);

  if (!booking) {
    return (
      <div className="p-6 text-center text-gubenAccent font-semibold">
        {t("bookingComponent.notFound")}
      </div>
    );
  }

  return (
    <div>
      {isPrivate === false && (
        <div className="relative w-full h-72 overflow-hidden">
          <Button
            variant="ghost"
            className='z-10 text-white gap-2 absolute top-4 left-4 flex items-center hover:bg-none'
            onClick={() => navigate({ to: "/booking" })}
          >
            <ArrowLeftIcon className='size-4' />
            <p>{t('AllBookings')}</p>
          </Button>
          <img
            src={booking.imgUrl}
            className="w-full h-full object-cover absolute top-0 left-0" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 flex flex-col items-center justify-center bg-red-600/70">
            <div className="mt-1 text-gubenAccent-foreground font-bold italic text-6xl tracking-tight">
              {title}
            </div>
          </div>
        </div>
      )}
      <div>
        <BookingDivider text={title} />
        <div className="p-5 grid grid-cols-3 gap-5">
          <div className="col-span-2">
              <TranslatedHtml
                className="prose max-w-none"
                text={booking.description} />
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
              prices={ticket.prices || []}
              title={ticket.title || title}
              flags={ticket.flags || booking.flags}
              location={ticket.location || booking.location}
              autoCommitNote={ticket.autoCommitNote || booking.autoCommitNote}
              imgUrl={ticket.imgUrl}
            />
          ))
        ) : (
          <PriceCard
            bookingUrl={booking.bookingUrl}
            price={booking.price}
            prices={booking.prices || []}
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