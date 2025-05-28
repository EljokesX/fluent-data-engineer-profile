
// Use the integrated Supabase client
export { supabase } from "@/integrations/supabase/client";

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Always configured when using integrated client
};
