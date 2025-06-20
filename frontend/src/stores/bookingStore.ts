import { create } from "zustand"

export type Ticket = {
  title: string;
  description: string;
  location: string;
  type: string;
  flags?: string[];
  autoCommitNote?: string;
  price: string;
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
  category: string;
  flags?: string[];
  bkid?: string;
  autoCommitNote?: string;
  tickets?: Ticket[];
  bookings?: Booking[];
};

type BookingStore = {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  setBookings: (bookings) => set(() => ({ bookings }))
}));