
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import { Provider, User } from "@supabase/supabase-js";
import { checkUserRole, ensureUserProfile } from "@/hooks/useAuthState";

export const signIn = async (
  email: string, 
  password: string, 
  setError: (error: string | null) => void
) => {
  setError(null);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      return { success: false, isAdmin: false };
    }

    toast.success("Successfully signed in!");
    
    // Check if user is admin
    if (data.user) {
      const isAdmin = await checkUserRole(data.user.id);
      return { success: true, isAdmin };
    }
    
    return { success: true, isAdmin: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred during sign in";
    setError(message);
    console.error("Error signing in:", error);
    toast.error(message);
    return { success: false, isAdmin: false };
  }
};

export const signInWithProvider = async (
  provider: Provider,
  setError: (error: string | null) => void
) => {
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
      return false;
    }

    if (!data.url) {
      const message = "Failed to start OAuth flow";
      setError(message);
      toast.error(message);
      return false;
    }

    // Redirect the user to the provider's OAuth flow
    window.location.href = data.url;
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred during OAuth sign in";
    setError(message);
    console.error("Error signing in with OAuth provider:", error);
    toast.error(message);
    return false;
  }
};

export const signUp = async (
  email: string, 
  password: string,
  setError: (error: string | null) => void
) => {
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
      return false;
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
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred during sign up";
    setError(message);
    console.error("Error signing up:", error);
    toast.error(message);
    return false;
  }
};

export const resetPassword = async (
  email: string,
  setError: (error: string | null) => void
) => {
  setError(null);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      return false;
    }

    toast.success("Password reset instructions sent to your email!");
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred while trying to reset password";
    setError(message);
    console.error("Error resetting password:", error);
    toast.error(message);
    return false;
  }
};

export const signOut = async (setError: (error: string | null) => void) => {
  setError(null);
  try {
    await supabase.auth.signOut();
    toast.success("Successfully signed out!");
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred during sign out";
    setError(message);
    console.error("Error signing out:", error);
    toast.error(message);
    return false;
  }
};
