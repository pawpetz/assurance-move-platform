/**
 * Booking data layer — backed by Supabase.
 *
 * Public/anonymous visitors can INSERT bookings (see the RLS policies in
 * supabase/migrations/0001_init.sql) but cannot read them back directly.
 * Status lookups for Track My Move go through the `get_booking_status`
 * RPC, which only ever exposes a few non-sensitive fields for a single
 * booking number.
 *
 * Reading full booking data (for the owner's admin dashboard) requires an
 * authenticated admin session and is not implemented yet — that lands with
 * the admin dashboard build.
 */
import { supabase } from "@/lib/supabase";

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

export interface NewBookingInput {
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
  photos: File[];
  customer: BookingCustomer;
}

export interface CreatedBooking {
  bookingNumber: string;
}

export interface BookingStatusRecord {
  bookingNumber: string;
  status: BookingStatus;
  serviceSlug: string | null;
  serviceOther: string | null;
  pickupDate: string | null;
  dropoffDate: string | null;
  createdAt: string;
}

function yesNoToBool(v: YesNo): boolean | null {
  if (v === "yes") return true;
  if (v === "no") return false;
  return null;
}

const PHOTO_BUCKET = "booking-photos";

export async function createBooking(input: NewBookingInput): Promise<CreatedBooking> {
  // 1. Create (or just record) the customer.
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      first_name: input.customer.firstName,
      last_name: input.customer.lastName,
      email: input.customer.email,
      phone: input.customer.phone,
    })
    .select("id")
    .single();

  if (customerError) {
    throw new Error(`Could not save customer information: ${customerError.message}`);
  }

  // 2. Create the booking itself.
  const knownServiceSlugs = new Set([
    "residential-moving",
    "commercial-office-moving",
    "local-moving",
    "long-distance-moving",
    "interstate-moving",
    "trucking-freight",
    "furniture-delivery",
    "junk-removal",
    "storage",
  ]);
  const serviceSlug = knownServiceSlugs.has(input.service) ? input.service : null;

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      customer_id: customer.id,
      service_slug: serviceSlug,
      service_other: serviceSlug ? null : input.serviceOther || input.service,

      pickup_address: input.pickup.address,
      pickup_unit: input.pickup.unit || null,
      pickup_city: input.pickup.city,
      pickup_state: input.pickup.state,
      pickup_zip: input.pickup.zip,
      pickup_contact_name: input.pickup.contactName || null,
      pickup_contact_phone: input.pickup.contactPhone || null,
      pickup_date: input.pickup.date || null,
      pickup_time_window: input.pickup.timeWindow || null,
      pickup_elevator: yesNoToBool(input.pickup.elevator),
      pickup_stairs: yesNoToBool(input.pickup.stairs),
      pickup_parking_difficult: yesNoToBool(input.pickup.parkingDifficult),
      pickup_access_notes: input.pickup.accessNotes || null,

      dropoff_address: input.dropoff.address,
      dropoff_unit: input.dropoff.unit || null,
      dropoff_city: input.dropoff.city,
      dropoff_state: input.dropoff.state,
      dropoff_zip: input.dropoff.zip,
      dropoff_contact_name: input.dropoff.contactName || null,
      dropoff_contact_phone: input.dropoff.contactPhone || null,
      dropoff_date: input.dropoff.date || null,
      dropoff_time_window: input.dropoff.timeWindow || null,
      dropoff_elevator: yesNoToBool(input.dropoff.elevator),
      dropoff_stairs: yesNoToBool(input.dropoff.stairs),
      dropoff_parking_difficult: yesNoToBool(input.dropoff.parkingDifficult),
      dropoff_access_notes: input.dropoff.accessNotes || null,

      rooms: input.rooms || null,
      estimated_boxes: input.estimatedBoxes || null,
      heavy_items: input.heavyItems || null,
      special_handling: input.specialHandling || null,
      large_item_description: input.largeItemDescription || null,

      preferred_contact_method: input.customer.preferredContact || null,
      customer_notes: input.customer.notes || null,
    })
    .select("id, booking_number")
    .single();

  if (bookingError) {
    throw new Error(`Could not create booking: ${bookingError.message}`);
  }

  // 3. Insert items.
  if (input.items.length > 0) {
    const { error: itemsError } = await supabase.from("booking_items").insert(
      input.items.map((item) => ({
        booking_id: booking.id,
        name: item.name,
        quantity: item.quantity,
      })),
    );
    if (itemsError) {
      console.error("Failed to save booking items:", itemsError.message);
    }
  }

  // 4. Upload photos to storage and record their paths.
  if (input.photos.length > 0) {
    for (const file of input.photos) {
      const path = `${booking.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file);
      if (uploadError) {
        console.error(`Failed to upload photo "${file.name}":`, uploadError.message);
        continue;
      }
      const { error: photoRowError } = await supabase
        .from("booking_photos")
        .insert({ booking_id: booking.id, storage_path: path });
      if (photoRowError) {
        console.error("Failed to record uploaded photo:", photoRowError.message);
      }
    }
  }

  return { bookingNumber: booking.booking_number as string };
}

export async function getBookingStatus(bookingNumber: string): Promise<BookingStatusRecord | null> {
  const { data, error } = await supabase.rpc("get_booking_status", {
    p_booking_number: bookingNumber.trim(),
  });

  if (error) {
    console.error("Failed to look up booking status:", error.message);
    return null;
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return {
    bookingNumber: row.booking_number,
    status: row.status as BookingStatus,
    serviceSlug: row.service_slug,
    serviceOther: row.service_other,
    pickupDate: row.pickup_date,
    dropoffDate: row.dropoff_date,
    createdAt: row.created_at,
  };
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
