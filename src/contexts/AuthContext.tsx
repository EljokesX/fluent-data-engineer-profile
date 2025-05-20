
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Provider } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { AuthContextType } from "@/types/auth.types";
import { signIn as authSignIn, signInWithProvider as authSignInWithProvider, signUp as authSignUp, signOut as authSignOut, resetPassword as authResetPassword } from "@/utils/authOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    session,
    isAdmin,
    isLoading,
    error,
    setIsAdmin,
    setError,
    supabaseConfigured
  } = useAuthState();
  
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password, setError);
    
    if (result.success) {
      setIsAdmin(result.isAdmin);
      if (result.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    await authSignInWithProvider(provider, setError);
  };

  const signUp = async (email: string, password: string) => {
    await authSignUp(email, password, setError);
  };

  const resetPassword = async (email: string) => {
    await authResetPassword(email, setError);
  };

  const signOut = async () => {
    const success = await authSignOut(setError);
    if (success) {
      navigate('/');
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
