import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseAnonKey) {
  // Thrown at build/runtime rather than silently falling back, so a missing
  // env var is obvious instead of causing confusing downstream failures.
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Booking, tracking, and admin " +
      "features will not work until these are set.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
