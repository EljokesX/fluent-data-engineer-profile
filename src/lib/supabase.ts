
import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "%cSupabase Configuration Error",
    "color: red; font-size: 16px; font-weight: bold;"
  );
  console.error(
    "Missing Supabase credentials. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables."
  );
  console.error(
    "To set up environment variables, create a .env file in the root directory with the following:"
  );
  console.error("VITE_SUPABASE_URL=https://your-project-id.supabase.co");
  console.error("VITE_SUPABASE_ANON_KEY=your-anon-key");
  console.error(
    "You can find these values in your Supabase dashboard under Project Settings > API"
  );
}

// If credentials are missing in development, create a mock client to prevent crashes
// but display clear messages to the user about what's happening
const url = supabaseUrl || "https://example.supabase.co";
const key = supabaseAnonKey || "example-anon-key";

export const supabase = createClient(url, key);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
