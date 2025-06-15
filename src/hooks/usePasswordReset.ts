
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthMode } from '@/types/auth';

interface UsePasswordResetProps {
  setMode: (mode: AuthMode) => void;
  setEmail: (email: string) => void;
}

export const usePasswordReset = ({ setMode, setEmail }: UsePasswordResetProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const checkForPasswordReset = async () => {
      // Check URL parameters for password reset
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const type = urlParams.get('type');
      
      console.log('URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
      
      if (type === 'recovery' && accessToken && refreshToken) {
        console.log('Password reset detected from URL parameters');
        
        // Set the session with the tokens from URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        
        if (error) {
          console.error('Error setting session for password reset:', error);
          toast({
            title: "Error",
            description: "Invalid password reset link. Please try again.",
            variant: "destructive",
          });
          setMode('signin');
        } else if (data.user) {
          console.log('Password reset session established');
          setMode('reset');
          setEmail(data.user.email || '');
        }
        return;
      }
      
      // Fallback: check current session for recovery
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && session.user.recovery_sent_at) {
        console.log('Password reset detected from session');
        setMode('reset');
        setEmail(session.user.email || '');
      }
    };

    checkForPasswordReset();
  }, [toast, setMode, setEmail]);
};
