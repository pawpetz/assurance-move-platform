-- Allows anonymous (public) visitors to upload photos into the private
-- booking-photos bucket when submitting the Book Now form. They can only
-- INSERT — not list, read, or delete — so a customer can't browse other
-- customers' photos.
create policy "public can upload booking photos"
on storage.objects
for insert
to anon
with check (bucket_id = 'booking-photos');

-- Admins get full access to the bucket (viewing photos in the dashboard,
-- deleting if needed).
create policy "admins full access booking photo objects"
on storage.objects
for all
to authenticated
using (bucket_id = 'booking-photos' and is_admin())
with check (bucket_id = 'booking-photos' and is_admin());
