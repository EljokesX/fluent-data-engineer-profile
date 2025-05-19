
import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are available and provide helpful error messages
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in environment variables.");
  console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
  console.error("For development, you can create a .env file in the root directory with placeholder values:");
  console.error("VITE_SUPABASE_URL=https://your-supabase-url.supabase.co");
  console.error("VITE_SUPABASE_ANON_KEY=your-anon-key");
}

// Create dummy client for development if credentials are missing
// This prevents the app from crashing during development/preview
const url = supabaseUrl || "https://placeholder-url.supabase.co";
const key = supabaseAnonKey || "placeholder-key";

export const supabase = createClient(url, key);
