
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseConfig = isSupabaseConfigured();
    setSupabaseConfigured(supabaseConfig);
    
    if (!supabaseConfig) {
      setIsLoading(false);
      setError("Supabase is not properly configured. Please check your environment variables.");
      toast.error("Authentication configuration error. Please check console for details.");
      console.error("Supabase is not configured properly. Check your environment variables.");
      return;
    }
    
    // Check active session
    const setupAuth = async () => {
      setIsLoading(true);
      try {
        // Get the current session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Check if user is admin by getting their roles
          await checkUserRole(data.session.user.id);
        }
        
        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setError(null); // Reset any previous errors on auth state change
            
            if (newSession?.user) {
              await checkUserRole(newSession.user.id);
              
              if (event === 'SIGNED_IN') {
                // For new OAuth users, check if a profile exists. If not, create one
                await ensureUserProfile(newSession.user);
              }
            } else {
              setIsAdmin(false);
            }
          }
        );
        
        setIsLoading(false);
        
        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Auth setup error:", err);
        setError(err instanceof Error ? err.message : "Unknown authentication error");
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  return {
    user,
    session,
    isAdmin,
    isLoading,
    error,
    setIsAdmin,
    setError,
    supabaseConfigured
  };
}

// Helper function to check user role
export const checkUserRole = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error("Error checking user role:", userError);
      return false;
    }
    
    if (userData) {
      return userData.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error("Error in checkUserRole:", error);
    return false;
  }
};

// Helper function to ensure user profile exists
export const ensureUserProfile = async (user: User) => {
  try {
    // Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create one
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id,
            email: user.email,
            role: 'guest',  // Default role for OAuth users is guest
          }
        ]);
        
      if (insertError) {
        console.error("Error creating profile for OAuth user:", insertError);
        toast.error("Failed to create user profile");
        return false;
      } else {
        console.log("Created new profile for OAuth user");
        return true;
      }
    }
    return true;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    return false;
  }
};
