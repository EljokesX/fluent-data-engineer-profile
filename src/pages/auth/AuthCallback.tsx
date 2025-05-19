
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for errors
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
        if (errorDescription) {
          setError(errorDescription);
          return;
        }

        // Wait a moment for Supabase Auth to process the callback
        setTimeout(() => {
          // Redirect based on role
          if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError('An unexpected error occurred during authentication');
      }
    };

    handleAuthCallback();
  }, [navigate, isAdmin]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center p-6 max-w-md">
        {error ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/auth/signin')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-turquoise mx-auto"></div>
            <p className="text-xl font-semibold">Processing your authentication...</p>
            <p className="text-muted-foreground">You'll be redirected automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
