import { CoordinatesResponse } from "@/endpoints/gubenSchemas";
import { BookingEvent, Ticket, useEventStore } from "@/stores/eventStore";
import { useEffect } from "react";

type EventIntegrationProps = {
  tenantId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onDone?: () => void;
};

export default function EventIntegration({ tenantId, setLoading, onDone }: EventIntegrationProps) {
  const addEvent = useEventStore((state) => state.addEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      const url = `${import.meta.env.VITE_BOOKING_URL}/html/${tenantId}/events`;
      try {
        const resp = await fetch(url);
        const html = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const eventElements = doc.querySelectorAll(".event");

        const events: BookingEvent[] = Array.from(eventElements).map(eventEl => {
          const title = eventEl.querySelector("h3")?.textContent?.trim() || "";
          const date = eventEl.querySelector(".date")?.textContent?.trim() || "";
          const organizer = eventEl.querySelector(".organizer-name")?.textContent?.trim() || "";
          const contactName = eventEl.querySelector(".contact-name")?.textContent?.trim() || "";
          const contactPhone = eventEl.querySelector(".contact-phone")?.textContent?.trim() || "";
          const contactEmail = eventEl.querySelector(".contact-email")?.textContent?.trim() || "";
          const flags = Array.from(eventEl.querySelectorAll(".flags .flag")).map(flag => flag.textContent?.trim() || "");
          const imgUrl = eventEl.querySelector("img")?.getAttribute("src") || "";

          let teaser = "";
          const descriptionElement = eventEl.querySelector(".teaser-text");         

          if (descriptionElement) {
            let currentElement = descriptionElement.nextElementSibling;
            const paragraphs: string[] = [];

            while (currentElement && currentElement.tagName === "P" && !currentElement.classList.length && currentElement.textContent?.trim() !== "") {
              paragraphs.push(currentElement.outerHTML);
              currentElement = currentElement.nextElementSibling;
            }

            teaser = [descriptionElement.outerHTML, ...paragraphs].join("\n");
          }

          const bkid = eventEl.querySelector(".btn-detail")?.getAttribute("href")?.split("bkid=")[1] || "";

          return { title, date, organizer, contactName, contactPhone, contactEmail, imgUrl, teaser, bkid, flags };
        });

        await Promise.all(events.map(async (event) => {
          if (!event.bkid) return;
          const detailUrl = `${import.meta.env.VITE_BOOKING_URL}/html/${tenantId}/events/${event.bkid}`;
          try {
            const detailResp = await fetch(detailUrl);
            const detailHtml = await detailResp.text();
            const detailDoc = parser.parseFromString(detailHtml, "text/html");
            const eventDiv = detailDoc.querySelector(".event");
            const infoDiv = eventDiv?.querySelector(".information");

            if (infoDiv) {
              let longDescription = "";
              const descriptionElement = infoDiv.querySelector(".description");         

              if (descriptionElement) {
                let currentElement = descriptionElement.nextElementSibling;
                const paragraphs: string[] = [];

                while (currentElement && currentElement.tagName === "P" && !currentElement.classList.length && currentElement.textContent?.trim() !== "") {
                  paragraphs.push(currentElement.outerHTML);
                  currentElement = currentElement.nextElementSibling;
                }

                longDescription = [descriptionElement.outerHTML, ...paragraphs].join("\n");
              }

              const ticketElements = eventDiv?.querySelectorAll(".related-tickets .booking-manager-list li.bt-ticket") ?? [];

              const tickets: Ticket[] = Array.from(ticketElements).map(ticketEl => {
                let ticketDescription = "";
                const descriptionElement = ticketEl.querySelector(".description");
                if (descriptionElement) {
                  let currentElement = descriptionElement.nextElementSibling;
                  const paragraphs: string[] = [];
                  
                  while (currentElement && currentElement.tagName === "P" && !currentElement.classList.length && currentElement.textContent?.trim() !== "") {
                    paragraphs.push(currentElement.outerHTML);
                    currentElement = currentElement.nextElementSibling;
                  }

                  ticketDescription = [descriptionElement.outerHTML, ...paragraphs].join("\n");
                }

                return {
                  title: ticketEl.querySelector("h4")?.textContent?.trim() || "",
                  description: ticketDescription,
                  location: ticketEl.querySelector(".location")?.textContent?.trim() || "",
                  type: ticketEl.querySelector(".type")?.textContent?.trim() || "",
                  flags: Array.from(ticketEl.querySelectorAll(".flag")).map(f => f.textContent?.trim() || ""),
                  autoCommitNote: ticketEl.querySelector(".autoCommitBooking")?.textContent?.trim() || "",
                  prices: Array.from(ticketEl.querySelectorAll(".price-category-list li")).map(li => ({
                    price: li.querySelector(".price-category-item-price")?.textContent?.trim() || "",
                    interval: li.querySelector(".price-category-interval")?.textContent?.trim() || "",
                    category: li.querySelector(".price-category")?.textContent?.trim() || ""
                  })),
                  bookingUrl: ticketEl.querySelector("a.btn-booking")?.getAttribute("href") || "",
                  bkid: ticketEl.querySelector("a.btn-detail")?.getAttribute("href") || "",
                  imgUrl: ticketEl.querySelector("img")?.getAttribute("src") || "/images/guben-city-booking-card-placeholder.png",
                };
              });

              event.details = {
                longDescription,
                eventLocation: eventDiv?.querySelector(".event-location .name")?.textContent?.trim() || "",
                eventLocationEmail: eventDiv?.querySelector(".event-location .email-address")?.textContent?.trim() || "",
                eventOrganizer: eventDiv?.querySelector(".event-organizer .name")?.textContent?.trim() || "",
                agenda: Array.from(eventDiv?.querySelectorAll(".schedules .schedule-list li") ?? []).map(li => li.textContent?.trim() || ""),
                teaserImage: infoDiv?.querySelector(".teaser-image")?.getAttribute("src") || event.imgUrl,
                street: eventDiv?.querySelector(".event-location .street")?.textContent?.trim() || "",
                houseNumber: eventDiv?.querySelector(".event-location .houseNumber")?.textContent?.trim() || "",
                zip: eventDiv?.querySelector(".event-location .zip")?.textContent?.trim() || "",
                city: eventDiv?.querySelector(".event-location .city")?.textContent?.trim() || "",
                tickets,
              };

              event.coordinates = await fetchCoordinates(
                event.details?.street,
                event.details?.houseNumber,
                event.details?.zip,
                event.details?.city);
            }
          } catch (err) {
            console.error("Failed to fetch event details for", event.bkid, err);
          }
        }));

        addEvent(events);
        onDone?.();
      } catch (error) {
        console.error("Failed to fetch events.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [tenantId]);

  return null;
}


async function fetchCoordinates(
  street: string | undefined,
  streetNumber: string | undefined,
  zip: string | undefined,
  city: string | undefined): Promise<CoordinatesResponse> {
  try {
    if (street === undefined || streetNumber === undefined || zip === undefined || city === undefined) return null;
    const query = `${streetNumber} ${street}, ${zip} ${city}`;
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      const first = data.features[0];
      const [lon, lat] = first.geometry.coordinates;

      return {
        latitude: lat,
        longitude: lon,
      };
    }

    return null;
  } catch (error) {
    console.error("Photon fetch failed:", error);
    return null;
  }
}