
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthMode } from '@/types/auth';

interface UseAuthSubmitProps {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  country: string;
  setMode: (mode: AuthMode) => void;
}

export const useAuthSubmit = ({
  mode,
  email,
  password,
  confirmPassword,
  fullName,
  country,
  setMode
}: UseAuthSubmitProps) => {
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'reset') {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }

        if (password.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters long",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) {
          toast({
            title: "Password reset failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "Your password has been updated successfully.",
          });
          navigate('/');
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        
        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Reset email sent!",
            description: "Check your email for password reset instructions.",
          });
          setMode('signin');
        }
      } else if (mode === 'signup') {
        if (!fullName || !country) {
          toast({
            title: "Error",
            description: "Please fill in all fields",
            variant: "destructive",
          });
          return;
        }
        
        const { error } = await signUp(email, password, fullName, country);
        
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success!",
            description: "Account created successfully. Please check your email to verify your account.",
          });
          setMode('signin');
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};
