-- Assurance Trucking LLC — initial schema
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE throughout.

-- ── Extensions ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Admins (owner + any future staff logins) ────────────────────────────
-- Rows here mark a Supabase auth user as an admin. The owner's row is added
-- manually after they sign up (see README instructions).
create table if not exists admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

-- ── Customers ────────────────────────────────────────────────────────────
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

-- ── Service types & service areas (admin-editable content) ─────────────
create table if not exists service_types (
  slug text primary key,
  name text not null,
  short_description text,
  overview text,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists service_areas (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  note text,
  sort_order integer not null default 0,
  active boolean not null default true
);

-- ── Bookings ─────────────────────────────────────────────────────────────
create type booking_status as enum (
  'New Request',
  'Under Review',
  'Quote Sent',
  'Awaiting Customer',
  'Confirmed',
  'Scheduled',
  'In Progress',
  'Picked Up',
  'In Transit',
  'Delivered',
  'Completed',
  'Cancelled'
);

create type payment_status as enum (
  'Unpaid',
  'Deposit Paid',
  'Partially Paid',
  'Paid',
  'Refunded'
);

create sequence if not exists booking_number_seq start 10001;

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null unique default ('AT-' || nextval('booking_number_seq')::text),
  customer_id uuid references customers (id) on delete set null,

  service_slug text references service_types (slug),
  service_other text,

  pickup_address text not null,
  pickup_unit text,
  pickup_city text not null,
  pickup_state text not null,
  pickup_zip text not null,
  pickup_contact_name text,
  pickup_contact_phone text,
  pickup_date date,
  pickup_time_window text,
  pickup_elevator boolean,
  pickup_stairs boolean,
  pickup_parking_difficult boolean,
  pickup_access_notes text,

  dropoff_address text not null,
  dropoff_unit text,
  dropoff_city text not null,
  dropoff_state text not null,
  dropoff_zip text not null,
  dropoff_contact_name text,
  dropoff_contact_phone text,
  dropoff_date date,
  dropoff_time_window text,
  dropoff_elevator boolean,
  dropoff_stairs boolean,
  dropoff_parking_difficult boolean,
  dropoff_access_notes text,

  rooms text,
  estimated_boxes text,
  heavy_items text,
  special_handling text,
  large_item_description text,

  preferred_contact_method text,
  customer_notes text,

  status booking_status not null default 'New Request',
  quote_amount numeric(10, 2),
  payment_status payment_status not null default 'Unpaid',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_status_idx on bookings (status);
create index if not exists bookings_created_at_idx on bookings (created_at desc);

create table if not exists booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  name text not null,
  quantity integer not null default 1
);

create table if not exists booking_photos (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- ── Quotes ───────────────────────────────────────────────────────────────
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  subtotal numeric(10, 2) not null default 0,
  additional_services numeric(10, 2) not null default 0,
  additional_fees numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  deposit numeric(10, 2) not null default 0,
  notes text,
  sent_at timestamptz,
  accepted_at timestamptz,
  declined_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes (id) on delete cascade,
  label text not null,
  amount numeric(10, 2) not null default 0
);

-- ── Payments ─────────────────────────────────────────────────────────────
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings (id) on delete cascade,
  quote_id uuid references quotes (id) on delete set null,
  amount numeric(10, 2) not null,
  kind text not null check (kind in ('deposit', 'balance', 'full')),
  provider text not null default 'stripe',
  provider_reference text,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

-- ── Notifications ────────────────────────────────────────────────────────
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings (id) on delete cascade,
  type text not null,
  channel text not null check (channel in ('email', 'sms')),
  recipient text not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── Reviews ──────────────────────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── FAQ items (admin-editable) ──────────────────────────────────────────
create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  active boolean not null default true
);

-- ── Settings (single row) ────────────────────────────────────────────────
create table if not exists settings (
  id boolean primary key default true constraint settings_singleton check (id),
  business_name text not null default 'Assurance Trucking LLC',
  phone text,
  email text,
  address text,
  hours jsonb,
  logo_url text,
  deposit_percentage numeric(5, 2) not null default 25,
  notification_preferences jsonb not null default '{}'::jsonb,
  terms text,
  privacy_policy text,
  cancellation_policy text,
  updated_at timestamptz not null default now()
);

insert into settings (id) values (true) on conflict (id) do nothing;

-- ── updated_at trigger for bookings ─────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────
alter table customers enable row level security;
alter table bookings enable row level security;
alter table booking_items enable row level security;
alter table booking_photos enable row level security;
alter table quotes enable row level security;
alter table quote_items enable row level security;
alter table payments enable row level security;
alter table notifications enable row level security;
alter table reviews enable row level security;
alter table faq_items enable row level security;
alter table service_types enable row level security;
alter table service_areas enable row level security;
alter table settings enable row level security;
alter table admin_users enable row level security;

-- Public (anon) can create a booking request, its items, and its photos —
-- this is what lets an unauthenticated customer submit the Book Now form.
create policy "public can insert bookings" on bookings
  for insert to anon with check (true);

create policy "public can insert booking items" on booking_items
  for insert to anon with check (true);

create policy "public can insert booking photos" on booking_photos
  for insert to anon with check (true);

create policy "public can insert customers" on customers
  for insert to anon with check (true);

-- Public can read active/published content used by the marketing site.
create policy "public can read active service types" on service_types
  for select to anon using (active = true);

create policy "public can read active service areas" on service_areas
  for select to anon using (active = true);

create policy "public can read published reviews" on reviews
  for select to anon using (published = true);

create policy "public can read active faq items" on faq_items
  for select to anon using (active = true);

create policy "public can read settings" on settings
  for select to anon using (true);

-- Everything else (full read/write) is restricted to admins.
create policy "admins full access customers" on customers for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access bookings" on bookings for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access booking_items" on booking_items for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access booking_photos" on booking_photos for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access quotes" on quotes for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access quote_items" on quote_items for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access payments" on payments for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access notifications" on notifications for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access reviews" on reviews for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access faq_items" on faq_items for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access service_types" on service_types for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access service_areas" on service_areas for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins full access settings" on settings for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins can read admin_users" on admin_users for select to authenticated using (is_admin());

-- ── Public booking-status lookup (Track My Move) ────────────────────────
-- Runs with owner privileges but only ever returns a few status fields for
-- a single booking number, so it can safely be called by anonymous users
-- without granting them table access.
create or replace function get_booking_status(p_booking_number text)
returns table (
  booking_number text,
  status booking_status,
  service_slug text,
  service_other text,
  pickup_date date,
  dropoff_date date,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select booking_number, status, service_slug, service_other, pickup_date, dropoff_date, created_at
  from bookings
  where booking_number = upper(p_booking_number);
$$;

grant execute on function get_booking_status(text) to anon, authenticated;

-- ── Seed service_types and service_areas from the current site content ──
-- (Safe to skip/edit — the frontend currently reads this from
-- src/lib/site-content.ts. Once wired to Supabase, that file's arrays
-- should be replaced with queries against these tables.)
insert into service_types (slug, name, short_description, sort_order) values
  ('residential-moving', 'Residential Moving', 'Household moves handled carefully, from a studio apartment to a full house.', 1),
  ('commercial-office-moving', 'Commercial & Office Moving', 'Office and business relocations scheduled around your operating hours.', 2),
  ('local-moving', 'Local Moving', 'Short-distance moves within the service area, usually completed same day.', 3),
  ('long-distance-moving', 'Long-Distance Moving', 'Longer hauls planned in advance with clear pickup and delivery timing.', 4),
  ('interstate-moving', 'Interstate Moving', 'Moves that cross state lines, coordinated end to end.', 5),
  ('trucking-freight', 'Trucking & Freight', 'Palletized loads, equipment, and general freight transport.', 6),
  ('furniture-delivery', 'Furniture Delivery', 'Single-item and store pickup deliveries, brought inside and placed.', 7),
  ('junk-removal', 'Junk Removal', 'Clear-outs of furniture, appliances, and general household items.', 8),
  ('storage', 'Storage', 'Short-term storage options between pickup and delivery.', 9)
on conflict (slug) do nothing;

insert into service_areas (region, note, sort_order) values
  ('Maryland', 'Statewide coverage subject to scheduling.', 1),
  ('Washington, DC', 'Full district coverage.', 2),
  ('Virginia', 'Northern Virginia and surrounding areas.', 3),
  ('Other areas', 'Long-distance and interstate jobs quoted on request.', 4)
on conflict do nothing;
