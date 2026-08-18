/**
 * TEMPORARY data layer for booking requests.
 *
 * There is no database connected yet. This module persists bookings to the
 * browser's localStorage so the booking flow and Track My Move page are
 * fully functional end-to-end during development.
 *
 * IMPORTANT: this only works on the device/browser that submitted the
 * booking. It is NOT shared across devices and is NOT what real customers
 * should rely on. Once Supabase is connected, replace the implementation of
 * these functions with real database calls — the function signatures are
 * written to match what the Supabase-backed version will look like, so
 * nothing else in the app should need to change.
 */

export type BookingStatus =
  | "New Request"
  | "Under Review"
  | "Quote Sent"
  | "Awaiting Customer"
  | "Confirmed"
  | "Scheduled"
  | "In Progress"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Completed"
  | "Cancelled";

export type TimeWindow = "morning" | "afternoon" | "evening" | "flexible" | "";
export type YesNo = "yes" | "no" | "";

export interface LocationDetails {
  address: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  contactName: string;
  contactPhone: string;
  date: string;
  timeWindow: TimeWindow;
  elevator: YesNo;
  stairs: YesNo;
  parkingDifficult: YesNo;
  accessNotes: string;
}

export interface BookingItemEntry {
  id: string;
  name: string;
  quantity: number;
}

export interface BookingCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: "phone" | "text" | "email" | "";
  notes: string;
}

export interface StoredBooking {
  bookingNumber: string;
  createdAt: string;
  status: BookingStatus;
  service: string;
  serviceOther: string;
  pickup: LocationDetails;
  dropoff: LocationDetails;
  items: BookingItemEntry[];
  rooms: string;
  estimatedBoxes: string;
  heavyItems: string;
  specialHandling: string;
  largeItemDescription: string;
  photoNames: string[];
  customer: BookingCustomer;
  quoteAmount: number | null;
  paymentStatus: "Unpaid" | "Deposit Paid" | "Partially Paid" | "Paid" | "Refunded";
}

const STORAGE_KEY = "at_bookings_v1";

function readAll(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredBooking[];
  } catch {
    return [];
  }
}

function writeAll(bookings: StoredBooking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function generateBookingNumber(existing: StoredBooking[]): string {
  const existingNumbers = new Set(existing.map((b) => b.bookingNumber));
  let candidate: string;
  do {
    const n = 10000 + Math.floor(Math.random() * 89999);
    candidate = `AT-${n}`;
  } while (existingNumbers.has(candidate));
  return candidate;
}

export type NewBookingInput = Omit<
  StoredBooking,
  "bookingNumber" | "createdAt" | "status" | "quoteAmount" | "paymentStatus"
>;

export function createBooking(input: NewBookingInput): StoredBooking {
  const all = readAll();
  const booking: StoredBooking = {
    ...input,
    bookingNumber: generateBookingNumber(all),
    createdAt: new Date().toISOString(),
    status: "New Request",
    quoteAmount: null,
    paymentStatus: "Unpaid",
  };
  writeAll([booking, ...all]);
  return booking;
}

export function listBookings(): StoredBooking[] {
  return readAll();
}

export function getBookingByNumber(bookingNumber: string): StoredBooking | undefined {
  const normalized = bookingNumber.trim().toUpperCase();
  return readAll().find((b) => b.bookingNumber.toUpperCase() === normalized);
}

export const bookingStatusOrder: BookingStatus[] = [
  "New Request",
  "Under Review",
  "Quote Sent",
  "Awaiting Customer",
  "Confirmed",
  "Scheduled",
  "In Progress",
  "Picked Up",
  "In Transit",
  "Delivered",
  "Completed",
];
