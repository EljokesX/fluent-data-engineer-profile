
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setError(null);
        
        if (newSession?.user) {
          // Check admin role and ensure profile exists
          const adminStatus = await checkUserRole(newSession.user.id);
          setIsAdmin(adminStatus);
          
          if (event === 'SIGNED_IN') {
            await ensureUserProfile(newSession.user);
          }
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setIsLoading(false);
          return;
        }
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          const adminStatus = await checkUserRole(currentSession.user.id);
          setIsAdmin(adminStatus);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Auth setup error:", err);
        setError(err instanceof Error ? err.message : "Unknown authentication error");
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
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
    
    return userData?.role === 'admin';
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
      .maybeSingle();
    
    if (profileError) {
      console.error("Error checking profile:", profileError);
      return false;
    }

    if (!profileData) {
      // Profile doesn't exist, create one
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id,
            email: user.email,
            role: 'guest',
          }
        ]);
        
      if (insertError) {
        console.error("Error creating profile:", insertError);
        toast.error("Failed to create user profile");
        return false;
      } else {
        console.log("Created new profile for user");
        return true;
      }
    }
    return true;
  } catch (error) {
    console.error("Error in ensureUserProfile:", error);
    return false;
  }
};
