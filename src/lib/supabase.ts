
import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are available and provide better guidance
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "%cSupabase Configuration Missing",
    "color: red; font-size: 16px; font-weight: bold;"
  );
  console.error(
    "Missing Supabase credentials. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables."
  );
  console.error(
    "To set up environment variables in Lovable:"
  );
  console.error(
    "1. Click on the green Supabase button on the top right of the interface"
  );
  console.error(
    "2. Connect to your Supabase project or create a new one"
  );
  console.error(
    "3. Your credentials will be automatically configured"
  );
}

// Create a mock client for development to prevent crashes
// but provide clear information about the configuration issue
const url = supabaseUrl || "https://placeholder.supabase.co";
const key = supabaseAnonKey || "placeholder-key";

export const supabase = createClient(url, key);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
