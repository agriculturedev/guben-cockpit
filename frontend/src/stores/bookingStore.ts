import { create } from "zustand"

export type Ticket = {
  title: string;
  description: string;
  location: string;
  type: string;
  flags?: string[];
  autoCommitNote?: string;
  price?: string;
    prices: {
    price: string;
    interval?: string;
    category?: string;
  }[];
  bookingUrl: string;
  bkid: string;
  imgUrl: string;
};

export type Booking = {
  title: string;
  description: string;
  location: string;
  type: string;
  imgUrl: string;
  bookingUrl: string;
  price: string;
  prices: {
    price: string;
    interval?: string;
    category?: string;
  }[];
  category: string;
  flags?: string[];
  bkid?: string;
  autoCommitNote?: string;
  tickets?: Ticket[];
  bookings?: Booking[];
};

type BookingStore = {
  bookings: Booking[];
  processedTenants: Set<string>;
  setBookings: (bookings: Booking[]) => void;
  addBookings: (bookings: Booking[]) => void;
  markProcessedTenants: (tenantId: string) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  processedTenants: new Set<string>(),
  markProcessedTenants: (tenantId) => 
    set((state) => ({
      processedTenants: new Set([...state.processedTenants, tenantId]),
    })),
  bookings: [],
  setBookings: (bookings) => set(() => ({ bookings })),
  addBookings: (newBookings) =>
    set((state) => {
      const all = [...state.bookings, ...newBookings];

      const unique = Array.from(
        new Map(all.map((b) => [b.bkid ?? b.bookingUrl, b])).values()
      );

      return { bookings: unique };
    }),
}));