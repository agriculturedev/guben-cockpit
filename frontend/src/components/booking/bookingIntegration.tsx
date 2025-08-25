import { useEffect, useRef, useCallback } from "react";
import { Booking, Ticket, useBookingStore } from "@/stores/bookingStore";

declare global {
  var BookingManager: any;
  var bookingManagerLoaded: boolean;
}

type BookingIntegrationProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tenantId: string;
  onDone?: () => void;
};

const loadBookingScript = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.bookingManagerLoaded && window.BookingManager) {
      resolve(window.BookingManager);
      return;
    }

    const existingScript = document.querySelector(`script[src="${import.meta.env.VITE_BOOKING_SDK}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.bookingManagerLoaded = true;
        const BookingManagerClass = window.BookingManager || (window as any).BookingManager;
        resolve(BookingManagerClass);
      });
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement("script");
    script.src = import.meta.env.VITE_BOOKING_SDK;
    script.async = true;
    script.onload = () => {
      window.bookingManagerLoaded = true;
      // Try to find BookingManager in different possible locations
      const BookingManagerClass = 
        window.BookingManager || 
        (window as any).BookingManager ||
        // If the class is defined globally without being attached to window
        (typeof BookingManager !== 'undefined' ? BookingManager : null);
      
      if (BookingManagerClass) {
        window.BookingManager = BookingManagerClass;
        resolve(BookingManagerClass);
      } else {
        reject(new Error('BookingManager class not found after script load'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default function BookingIntegration({ setLoading, tenantId, onDone }: BookingIntegrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const bookingManagerRef = useRef<any>(null);
  const isProcessingRef = useRef(false);
  const addBooking = useBookingStore((state) => state.addBookings);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    bookingManagerRef.current = null;
    isProcessingRef.current = false;
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    // Prevent multiple concurrent executions for the same tenant
    if (isProcessingRef.current) {
      console.log(`Already processing tenant ${tenantId}, skipping...`);
      return;
    }
    
    const processBookableElements = async (bookableElements: NodeListOf<Element>) => {
      if (!isMounted || isProcessingRef.current === false) return;

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
            flags.splice(index, 1);
          }
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
          bookingUrl, 
          bkid, 
          imgUrl, 
          category, 
          tickets: []
        });
      });

      const fetchTicketsAndBookables = async (bookable: Booking) => {
        if (!bookable.bkid || bookable.bkid === "#" || !isMounted || !isProcessingRef.current) return;
        
        const url = `${import.meta.env.VITE_BOOKING_URL}/html/${tenantId}/bookables/${bookable.bkid}`;
        try {
          const resp = await fetch(url);
          const html = await resp.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          
          if (!isMounted || !isProcessingRef.current) return;

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
            const ticketImgUrl = ticketEl.querySelector("img")?.getAttribute("src") || "/images/guben-city-booking-card-placeholder.png";

            return {
              title: ticketTitle,
              location: ticketLocation,
              type: ticketType,
              flags: ticketFlags,
              autoCommitNote: ticketAutoNote,
              price: ticketPrice,
              bookingUrl: ticketBookingUrl,
              description: ticketDescription,
              bkid: ticketBkid,
              imgUrl: ticketImgUrl,
              tenantId
            } as Ticket;
          });

          const roomeElement = doc.querySelectorAll(".bt-room");
          bookable.bookings = Array.from(roomeElement).map(roomEl => {
            const bkid = roomEl.querySelector(".btn-detail")?.getAttribute("href")?.split("bkid=")[1] || "";
            if (bookable.bkid === bkid) return null;
            return bookables.find(b => b.bkid === bkid) || null;
          }).filter((b): b is Booking => b !== null);
        } catch (err) {
          console.error("Failed to fetch tickets for bookable", bookable.bkid, "in tenant", tenantId, err);
        }
      };

      try {
        await Promise.all(bookables.map(fetchTicketsAndBookables));
        
        if (!isMounted || !isProcessingRef.current) return;

        const nestedBkids = new Set<String>();

        for (const bookable of bookables) {
          if (bookable.bookings) {
            for (const nested of bookable.bookings) {
              if (nested.bkid) nestedBkids.add(nested.bkid);
            }
          }
        }

        const parentBookings = bookables.filter(b => !nestedBkids.has(b.bkid || ""));
        
        addBooking(parentBookings);
        setLoading(false);
        
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        
        isProcessingRef.current = false;
        if (onDone) onDone();
      } catch (error) {
        console.error('Error processing bookables for tenant', tenantId, ':', error);
        if (isMounted) {
          setLoading(false);
          isProcessingRef.current = false;
          if (onDone) onDone();
        }
      }
    };

    const initializeBooking = async () => {
      try {
        cleanup();
        const BookingManagerClass = await loadBookingScript();

        isProcessingRef.current = true;
        if (!isMounted || !isProcessingRef.current) return;
        const bm = new BookingManagerClass(import.meta.env.VITE_BOOKING_URL, tenantId);
        bookingManagerRef.current = bm;
        await bm.init();

        if (!isMounted || !isProcessingRef.current) return;

        const observer = new MutationObserver(() => {
          if (!isMounted || !containerRef.current || !isProcessingRef.current) return;

          const bookableElements = containerRef.current.querySelectorAll(".bt-room, .bt-resource");
          if (bookableElements.length > 0) {
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
            processBookableElements(bookableElements);
          }
        });

        observerRef.current = observer;
        
        if (containerRef.current) {
          observer.observe(containerRef.current, { childList: true, subtree: true });
        }

      } catch (error) {
        console.error(`Error initializing booking for tenant ${tenantId}:`, error);
        if (isMounted) {
          setLoading(false);
          isProcessingRef.current = false;
          if (onDone) onDone();
        }
      }
    };

    initializeBooking();

    return () => {
      isMounted = false;
      isProcessingRef.current = false;
      cleanup();
    };
  }, [tenantId]);

  return (
    <div 
      ref={containerRef} 
      className="bm-bookable-list" 
      data-type="" 
      data-ids="" 
      style={{ display: "none" }} 
    />
  );
}