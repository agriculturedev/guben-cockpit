import { CoordinatesResponse } from "@/endpoints/gubenSchemas";
import { create } from "zustand";

export type BookingEvent = {
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
  flags?: string[];
	coordinates?: CoordinatesResponse | null;
};

export type EventDetails = {
  longDescription?: string;
  eventLocation?: string;
  eventLocationEmail?: string;
  eventOrganizer?: string;
  agenda?: string[];
  teaserImage?: string;
  street?: string;
	houseNumber?: string;
  zip?: string;
  city?: string;
};

type EventStore = {
	events: BookingEvent[];
	processedTenants: Set<string>;
	setEvents: (events: BookingEvent[]) => void;
	addEvents: (events: BookingEvent[]) => void;
	markProcessedTenants: (tenantId: string) => void;
}

export const useEventStore = create<EventStore>((set) => ({
	processedTenants: new Set<string>(),
	markProcessedTenants: (tenantId) =>
		set((state) => ({
			processedTenants: new Set([...state.processedTenants, tenantId]),
		})),
	events: [],
	setEvents: (events) => set(() => ({ events })),
	addEvents: (newEvents) =>
		set((state) => {
			const all = [...state.events, ...newEvents];

			const unique = Array.from(
				new Map(all.map((e) => [e.bkid, e])).values()
			);

			return { events: unique };
		}),
}));