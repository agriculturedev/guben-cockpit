import { EventResponse } from "@/endpoints/gubenSchemas";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, CalendarIcon, ClockIcon, MapPinIcon, PenLine } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function EventCard({
  event
}: { event: EventResponse }) {
  const { t } = useTranslation("common");

  const [startDate, endDate] = useMemo(() => [
    new Date(event.startDate),
    new Date(event.endDate)
  ], [event]);

  return (
    <div className="bg-white rounded-2xl shadow-md h-80 p-8 space-y-4 w-full grid grid-cols-2 gap-8">
      <div className="space-y-2">
        <h2>{event.title}</h2>
        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
        <Link to={"/events/" + event.id} className={"flex flex-nowrap gap-2 items-center border w-min rounded-md px-2 py-1 text-muted-foreground hover:text-red-500 hover:bg-red-50"}>
          <p className="text-nowrap">{t("MoreInformation")}</p>
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {event.categories.map(c => (
            <span key={c.id} className="border text-sm text-muted-foreground rounded-full py-1 px-2">{c.name}</span>
          ))}
        </div>

        <div className="flex gap-1 items-center text-muted-foreground">
          <MapPinIcon className="size-4" />
          <p className="">{event.location.street}, {event.location.zip} {event.location.city}</p>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <ClockIcon className={"size-4"} />
          <p className="">{startDate.formatDateTime().replaceAll(".", "/")} - {endDate.formatDateTime().replaceAll(".", "/")}</p>
        </div>
      </div>
    </div>
  )
}

function useDateFormatting() {
  const { i18n } = useTranslation();
  const { format: intlFormatDate } = Intl.DateTimeFormat(i18n.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const { format: IntlFormatTime } = Intl.DateTimeFormat(i18n.language, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const formatDate = (value: string) => {
    const date = new Date(value);
    const formatted = intlFormatDate(date);
    return formatted.replaceAll(".", "/");
  }

  const formatTime = (value: string) => {
    const date = new Date(value);
    return IntlFormatTime(date);
  }

  return {
    formatDate,
    formatTime
  };
}

export default EventCard;
