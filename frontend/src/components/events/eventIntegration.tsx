import { useEffect, useRef } from "react";

type BookingEvent = {
  title: string;
  date: string;
  organizer: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  teaser: string;
  bkid: string;
  details?: EventDetails;
  imgUrl: string;
  flags?: string[],
};

type EventDetails = {
  longDescription?: string;
  eventLocation?: string;
  eventLocationEmail?: string;
  eventOrganizer?: string;
  agenda?: string[];
  teaserImage?: string;
  street?: string;
  zip?: string;
  city?: string;
};

type EventIntegrationProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setEvents: React.Dispatch<React.SetStateAction<BookingEvent[]>>;
};


export default function EventIntegration({ setLoading, setEvents }: EventIntegrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_BOOKING_SDK;
    script.async = true;
    script.onload = () => {
      const bm = new BookingManager();
      bm.url = import.meta.env.VITE_BOOKING_UTL;
      bm.tenant = import.meta.env.VITE_BOOKING_TENANT;
      bm.init();

      const fetchEvents = async () => {
        const url = `${import.meta.env.VITE_BOOKING_URL}/html/${import.meta.env.VITE_BOOKING_TENANT}/events`;
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
              const paragraphs = [];

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
            const detailUrl = `${import.meta.env.VITE_BOOKING_URL}/html/${import.meta.env.VITE_BOOKING_TENANT}/events/${event.bkid}`;
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
                  const paragraphs = [];

                  while (currentElement && currentElement.tagName === "P" && !currentElement.classList.length && currentElement.textContent?.trim() !== "") {
                    paragraphs.push(currentElement.outerHTML);
                    currentElement = currentElement.nextElementSibling;
                  }

                  longDescription = [descriptionElement.outerHTML, ...paragraphs].join("\n");
                }

                event.details = {
                  longDescription,
                  eventLocation: eventDiv?.querySelector(".event-location .name")?.textContent?.trim() || "",
                  eventLocationEmail: eventDiv?.querySelector(".event-location .email-address")?.textContent?.trim() || "",
                  eventOrganizer: eventDiv?.querySelector(".event-organizer .name")?.textContent?.trim() || "",
                  agenda: Array.from(eventDiv?.querySelectorAll(".schedules .schedule-list li") ?? []).map(li => li.textContent?.trim() || ""),
                  teaserImage: infoDiv?.querySelector(".teaser-image")?.getAttribute("src") || event.imgUrl,
                  street: eventDiv?.querySelector(".event-location .street")?.textContent?.trim() || "",
                  zip: eventDiv?.querySelector(".event-location .zip")?.textContent?.trim() || "",
                  city: eventDiv?.querySelector(".event-location .city")?.textContent?.trim() || "",
                };

                console.log(event.details);
              }
            } catch (err) {
              console.error("Failed to fetch event details for", event.bkid, err);
            }
          }));

          setEvents(events);
        } catch (error) {
          console.error("Failed to fetch events.", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    };
    document.head.appendChild(script);
  }, []);

  return <div ref={containerRef} style={{ display: "none" }} />;
};