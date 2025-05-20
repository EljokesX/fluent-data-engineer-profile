
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Session, User, Provider } from "@supabase/supabase-js";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const navigate = useNavigate();

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
  
  // Helper function to check user role
  const checkUserRole = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (userError) {
        console.error("Error checking user role:", userError);
        return;
      }
      
      if (userData) {
        setIsAdmin(userData.role === 'admin');
      }
    } catch (error) {
      console.error("Error in checkUserRole:", error);
    }
  };
  
  // Helper function to ensure user profile exists
  const ensureUserProfile = async (user: User) => {
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
        } else {
          console.log("Created new profile for OAuth user");
          setIsAdmin(false); // New OAuth users are guests by default
        }
      }
    } catch (error) {
      console.error("Error in ensureUserProfile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      toast.success("Successfully signed in!");
      
      // Check if user is admin
      if (data.user) {
        await checkUserRole(data.user.id);
        
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred during sign in";
      setError(message);
      console.error("Error signing in:", error);
      toast.error(message);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      if (!data.url) {
        const message = "Failed to start OAuth flow";
        setError(message);
        toast.error(message);
        return;
      }

      // Redirect the user to the provider's OAuth flow
      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred during OAuth sign in";
      setError(message);
      console.error("Error signing in with OAuth provider:", error);
      toast.error(message);
    }
  };

  const signUp = async (email: string, password: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      // Create profile with default guest role
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              email: data.user.email,
              role: 'guest',
            }
          ]);
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred during sign up";
      setError(message);
      console.error("Error signing up:", error);
      toast.error(message);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
        return;
      }

      toast.success("Password reset instructions sent to your email!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred while trying to reset password";
      setError(message);
      console.error("Error resetting password:", error);
      toast.error(message);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      toast.success("Successfully signed out!");
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred during sign out";
      setError(message);
      console.error("Error signing out:", error);
      toast.error(message);
    }
  };

  const value = {
    user,
    session,
    isAdmin,
    isLoading,
    error,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    resetPassword,
    supabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
