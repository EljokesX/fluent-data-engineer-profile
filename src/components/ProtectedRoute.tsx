
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  
  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseConfigured = !!supabaseUrl;

  // If Supabase is not configured, show a helpful message
  if (!supabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-6 border border-border rounded-lg bg-card shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Authentication Not Configured</h2>
          <div className="mb-6 p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-md">
            <p>Supabase authentication is not configured properly.</p>
            <p className="mt-2">Please add your Supabase credentials to the environment variables.</p>
          </div>
          <p className="text-muted-foreground text-sm">
            See the README.md file for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
