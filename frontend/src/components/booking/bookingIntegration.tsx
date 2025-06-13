import { useEffect, useRef } from "react";
import { Booking, Ticket, useBookingStore } from "@/stores/bookingStore";

declare global {
  var BookingManager: any;
}

type BookingIntegrationProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BookingIntegration({ setLoading }: BookingIntegrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setBookings = useBookingStore((state) => state.setBookings);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_BOOKING_SDK
    script.async = true;
    script.onload = () => {
      const bm = new BookingManager();
      bm.url = import.meta.env.VITE_BOOKING_URL;
      bm.tenant = import.meta.env.VITE_BOOKING_TENANT;
      bm.init();

      const observer = new MutationObserver(() => {
        if (containerRef.current) {
          const bookableElements = containerRef.current.querySelectorAll(".bt-room, .bt-resource");
          if (bookableElements.length > 0) {
            const bookables: Booking[] = [];
      
            bookableElements.forEach((el) => {
              const title = el.querySelector("h4")?.textContent?.trim() || "";

              let description = "";
              const descriptionElement = el.querySelector(".description");         

              if (descriptionElement) {
                let currentElement = descriptionElement.nextElementSibling;
                const paragraphs = [];

                while (currentElement && currentElement.tagName === "P" && !currentElement.classList.length && currentElement.textContent?.trim() !== "") {
                  paragraphs.push(currentElement.outerHTML);
                  currentElement = currentElement.nextElementSibling;
                }

                description = [descriptionElement.outerHTML, ...paragraphs].join("\n");
              }
            
              const location = el.querySelector(".location")?.textContent?.trim() || "";
              const type = el.querySelector(".type")?.textContent?.trim() || "";
            
              const flags = Array.from(el.querySelectorAll(".flags .flag")).map(flag => flag.textContent?.trim() || "");
            
              const autoCommitNote = el.querySelector(".autoCommitBooking")?.textContent?.trim() || "";
              const price = el.querySelector(".price")?.textContent?.trim() || "";
            
              const bookingUrl = el.querySelector(".btn-booking")?.getAttribute("href") || "";

              const bkid = el.querySelector(".btn-detail")?.getAttribute("href")?.split("bkid=")[1] || "";
              const imgUrl = el.querySelector("img")?.getAttribute("src") || "/images/guben-city-booking-card-placeholder.png";

              let category = "room";
              if (flags.includes("Sport")) {
                category = "sport";
                const index = flags.indexOf("Sport", 0);
                if (index > -1) {
                  flags.splice(index, 1)
                }
              } else if (el.classList.contains("bt-resource")) {
                category = "resource";
              }
            
              bookables.push({ title, description, location, type, flags, autoCommitNote, price, bookingUrl, bkid, imgUrl, category, tickets: [] });
            });

            const fetchTicketsForBookable = async (bookable: Booking) => {
              if (!bookable.bkid || bookable.bkid === "#") return;
              const url = `${import.meta.env.VITE_BOOKING_URL}/html/${import.meta.env.VITE_BOOKING_TENANT}/bookables/${bookable.bkid}`;
              try {
                const resp = await fetch(url);
                const html = await resp.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const ticketElements = doc.querySelectorAll(".bt-ticket");
                bookable.tickets = Array.from(ticketElements).map(ticketEl => {
                  const ticketTitle = ticketEl.querySelector("h4")?.textContent?.trim() || "";

                  let ticketDescription = "";
                  const descriptionElement = ticketEl.querySelector(".description");

                  if (descriptionElement) {
                    let currentElement = descriptionElement.nextElementSibling;
                    const paragraphs = [];

                    while (currentElement && currentElement.tagName === "P" && !currentElement.classList.length && currentElement.textContent?.trim() !== "") {
                      paragraphs.push(currentElement.outerHTML);
                      currentElement = currentElement.nextElementSibling;
                    }

                    ticketDescription = [descriptionElement.outerHTML, ...paragraphs].join("\n");
                  }

                  const ticketLocation = ticketEl.querySelector(".location")?.textContent?.trim() || "";
                  const ticketType = ticketEl.querySelector(".type")?.textContent?.trim() || "";
                  const ticketAutoNote = ticketEl.querySelector(".autoCommitBooking")?.textContent?.trim() || "";
                  const ticketPrice = ticketEl.querySelector(".price")?.textContent?.trim() || "";
                  const ticketBookingUrl = ticketEl.querySelector(".btn-booking")?.getAttribute("href") || "";
                  const ticketBkid = ticketEl.querySelector(".btn-detail")?.getAttribute("href")?.split("bkid=")[1] || "";
                  const ticketFlags = Array.from(ticketEl.querySelectorAll(".flag")).map(f => f.textContent?.trim() || "");

                  return {
                    title: ticketTitle,
                    location: ticketLocation,
                    type: ticketType,
                    flags: ticketFlags,
                    autoCommitNote: ticketAutoNote,
                    price: ticketPrice,
                    bookingUrl: ticketBookingUrl,
                    description: ticketDescription,
                    bkid: ticketBkid
                  } as Ticket;
                });
            } catch (err) {
              console.error("Failed to fetch tickets for bookable", bookable.bkid, err);
            }
          };

          Promise.all(bookables.map(fetchTicketsForBookable)).then(() => {
            setBookings(bookables);
            setLoading(false);
            observer.disconnect();
          });
        }
      }
    });
    observer.observe(containerRef.current!, { childList: true, subtree: true });
  };
  
    document.head.appendChild(script);
  }, [setBookings, setLoading]);

  return (
    <div ref={containerRef} className="bm-bookable-list" style={{ display: "none" }} />
  );
};