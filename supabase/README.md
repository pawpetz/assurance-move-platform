# Supabase setup

## 1. Run the schema

In your Supabase project: **SQL Editor → New query**, paste the contents of
`migrations/0001_init.sql`, and run it. It's safe to re-run.

## 2. Create the owner's admin login

1. In Supabase, go to **Authentication → Users → Add user** and create an
   account for the owner (email + password, or send an invite).
2. Copy that user's UUID from the users list.
3. Back in the SQL Editor, run:

   ```sql
   insert into admin_users (user_id) values ('paste-the-uuid-here');
   ```

That row is what grants access to the admin dashboard — without it, a
logged-in user can only see what the public site can see.

## 3. Storage bucket for booking photos

Go to **Storage → New bucket**, name it `booking-photos`, and leave it
**private** (not public). The app uploads customer photos here and the admin
dashboard fetches them via signed URLs, so they're never publicly listable.

## 4. Environment variables

Once the schema and bucket exist, add these to the app's environment
(`.env.local` for local dev, and your hosting provider's environment
variables for production):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never put the `service_role` key in a `VITE_`-prefixed variable — anything
prefixed `VITE_` is bundled into the client-side JavaScript and becomes
publicly visible.
