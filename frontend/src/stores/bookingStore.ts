import { create } from "zustand"

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
  detailsLink?: string;
  autoCommitNote?: string;
};

type BookingStore = {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  setBookings: (bookings) => set(() => ({ bookings }))
}));