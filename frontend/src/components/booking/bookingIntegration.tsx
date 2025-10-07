import { useEffect } from "react";
import { Booking, Ticket, useBookingStore } from "@/stores/bookingStore";

type BookingIntegrationProps = {
  tenantId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onDone?: () => void;
  privateTenant?: boolean;
};

export default function BookingIntegration({ tenantId, setLoading, onDone, privateTenant = false }: BookingIntegrationProps) {
  const addBooking = useBookingStore((state) => state.addBookings);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      const url = `${import.meta.env.VITE_BOOKING_URL}/html/${tenantId}/bookables`;

      try {
        const resp = await fetch(url);
        const html = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const bookingElements = doc.querySelectorAll(".bt-room, .bt-resource");

        const bookables: Booking[] = [];

        bookingElements.forEach((el) => {
          const title = el.querySelector("h4")?.textContent?.trim() || "";

          let description = "";
          const descriptionElement = el.querySelector(".description");
          if (descriptionElement) {
            let currentElement = descriptionElement.nextElementSibling;
            const paragraphs: string[] = [];
            while (
              currentElement &&
              currentElement.tagName === "P" &&
              !currentElement.classList.length &&
              currentElement.textContent?.trim() !== ""
            ) {
              paragraphs.push(currentElement.outerHTML);
              currentElement = currentElement.nextElementSibling;
            }
            description = [descriptionElement.outerHTML, ...paragraphs].join("\n");
          }

          const location = el.querySelector(".location")?.textContent?.trim() || "";
          const type = el.querySelector(".type")?.textContent?.trim() || "";
          const flags = Array.from(el.querySelectorAll(".flags .flag")).map((f) => f.textContent?.trim() || "");
          const autoCommitNote = el.querySelector(".autoCommitBooking")?.textContent?.trim() || "";
          const price = el.querySelector(".price")?.textContent?.trim() || "";
          const prices = Array.from(el.querySelectorAll(".price-category-list li")).map(li => ({
            price: li.querySelector(".price-category-item-price")?.textContent?.trim() || "",
            interval: li.querySelector(".price-category-interval")?.textContent?.trim() || "",
            category: li.querySelector(".price-category")?.textContent?.trim() || ""
          }));
          const bookingUrl = el.querySelector(".btn-booking")?.getAttribute("href") || "";
          const bkid = el.querySelector(".btn-detail")?.getAttribute("href")?.split("bkid=")[1] || "";
          const imgUrl = el.querySelector("img")?.getAttribute("src") || "/images/guben-city-booking-card-placeholder.png";

          let category = "room";
          if (privateTenant) {
            category = "private";
          } else if (flags.includes("Sport")) {
            category = "sport";
          } else if (el.classList.contains("bt-resource")) {
            category = "resource";
          }

          bookables.push({
            title,
            description,
            location,
            type,
            flags,
            autoCommitNote,
            price,
            prices,
            bookingUrl,
            bkid,
            imgUrl,
            category,
            tickets: [],
            bookings: [],
          });
        });

        const fetchTickets = async (bookable: Booking) => {
          if (!bookable.bkid || bookable.bkid === "#") return;

          const detailUrl = `${import.meta.env.VITE_BOOKING_URL}/html/${tenantId}/bookables/${bookable.bkid}`;
          try {
            const resp = await fetch(detailUrl);
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const ticketElements = doc.querySelectorAll(".bt-ticket");
            bookable.tickets = Array.from(ticketElements).map((ticketEl) => {
              const ticketTitle = ticketEl.querySelector("h4")?.textContent?.trim() || "";

              let ticketDescription = "";
              const descriptionElement = ticketEl.querySelector(".description");
              if (descriptionElement) {
                let currentElement = descriptionElement.nextElementSibling;
                const paragraphs: string[] = [];
                while (
                  currentElement &&
                  currentElement.tagName === "P" &&
                  !currentElement.classList.length &&
                  currentElement.textContent?.trim() !== ""
                ) {
                  paragraphs.push(currentElement.outerHTML);
                  currentElement = currentElement.nextElementSibling;
                }
                ticketDescription = [descriptionElement.outerHTML, ...paragraphs].join("\n");
              }

              const ticketLocation = ticketEl.querySelector(".location")?.textContent?.trim() || "";
              const ticketType = ticketEl.querySelector(".type")?.textContent?.trim() || "";
              const ticketAutoNote = ticketEl.querySelector(".autoCommitBooking")?.textContent?.trim() || "";
              const ticketPrice = ticketEl.querySelector(".price")?.textContent?.trim() || "";
              const ticketPrices = Array.from(ticketEl.querySelectorAll(".price-category-list li")).map(li => ({
                price: li.querySelector(".price-category-item-price")?.textContent?.trim() || "",
                interval: li.querySelector(".price-category-interval")?.textContent?.trim() || "",
                category: li.querySelector(".price-category")?.textContent?.trim() || ""
              }));
              const ticketBookingUrl = ticketEl.querySelector("a")?.getAttribute("href") || "";
              const ticketBkid = ticketEl.querySelector(".btn-detail")?.getAttribute("href")?.split("bkid=")[1] || "";
              const ticketFlags = Array.from(ticketEl.querySelectorAll(".flag")).map((f) => f.textContent?.trim() || "");
              const ticketImgUrl = ticketEl.querySelector("img")?.getAttribute("src") || "/images/guben-city-booking-card-placeholder.png";

              return {
                title: ticketTitle,
                description: ticketDescription,
                location: ticketLocation,
                type: ticketType,
                flags: ticketFlags,
                autoCommitNote: ticketAutoNote,
                price: ticketPrice,
                prices: ticketPrices,
                bookingUrl: ticketBookingUrl,
                bkid: ticketBkid,
                imgUrl: ticketImgUrl,
                tenantId,
              } as Ticket;
            });

            const roomeElements = doc.querySelectorAll(".bt-room");
            bookable.bookings = Array.from(roomeElements)
              .map((roomEl) => {
                const bkid =
                  roomEl.querySelector(".btn-detail")?.getAttribute("href")?.split("bkid=")[1] || "";
                if (bookable.bkid === bkid) return null;
                return bookables.find((b) => b.bkid === bkid) || null;
              })
              .filter((b): b is Booking => b !== null);
          } catch (err) {
            console.error("Failed to fetch tickets for bookable", bookable.bkid, "in tenant", tenantId, err);
          }
        };

        await Promise.all(bookables.map(fetchTickets));

        const nestedBkids = new Set<string>();
        for (const bookable of bookables) {
          if (bookable.bookings) {
            for (const nested of bookable.bookings) {
              if (nested.bkid) nestedBkids.add(nested.bkid);
            }
          }
        }
        const parentBookings = bookables.filter((b) => !nestedBkids.has(b.bkid || ""));

        addBooking(parentBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
        if (onDone) onDone();
      }
    };

    fetchBookings();
  }, [tenantId]);

  return null;
}
