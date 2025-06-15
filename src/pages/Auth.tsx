import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, DollarSign, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const countries = [
  { code: 'US', name: 'United States', currency: 'USD ($)' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP (£)' },
  { code: 'CA', name: 'Canada', currency: 'CAD (C$)' },
  { code: 'AU', name: 'Australia', currency: 'AUD (A$)' },
  { code: 'DE', name: 'Germany', currency: 'EUR (€)' },
  { code: 'FR', name: 'France', currency: 'EUR (€)' },
  { code: 'JP', name: 'Japan', currency: 'JPY (¥)' },
  { code: 'IN', name: 'India', currency: 'INR (₹)' },
  { code: 'BR', name: 'Brazil', currency: 'BRL (R$)' },
  { code: 'MX', name: 'Mexico', currency: 'MXN ($)' },
  { code: 'ES', name: 'Spain', currency: 'EUR (€)' },
  { code: 'IT', name: 'Italy', currency: 'EUR (€)' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR (€)' },
  { code: 'SE', name: 'Sweden', currency: 'SEK (kr)' },
  { code: 'NO', name: 'Norway', currency: 'NOK (kr)' },
  { code: 'DK', name: 'Denmark', currency: 'DKK (kr)' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF (CHF)' },
  { code: 'SG', name: 'Singapore', currency: 'SGD (S$)' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD (HK$)' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR (R)' }
];

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for password reset session on component mount
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
  }, [toast]);

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

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'reset': return 'Set New Password';
      default: return 'Welcome Back';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signup': return 'Join FinanceFlow to track your expenses';
      case 'forgot': return 'Enter your email to reset your password';
      case 'reset': return 'Enter your new password below';
      default: return 'Sign in to your FinanceFlow account';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-sm sm:max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center space-y-3 px-4 sm:px-6 pt-6 pb-4">
          <CardTitle className="flex items-center justify-center space-x-2 text-xl sm:text-2xl">
            <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
            <span>{getTitle()}</span>
          </CardTitle>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {getDescription()}
          </p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="auth-fullName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="auth-fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-base"
                />
              </div>
            )}
            
            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="auth-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-base"
                  disabled={mode === 'reset'}
                />
              </div>
            )}

            {mode === 'reset' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="auth-email-display" className="text-sm font-medium">Email</Label>
                  <Input
                    id="auth-email-display"
                    type="email"
                    value={email}
                    disabled
                    className="h-10 sm:h-11 text-base bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-password" className="text-sm font-medium">New Password</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 sm:h-11 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-confirm-password" className="text-sm font-medium">Confirm New Password</Label>
                  <Input
                    id="auth-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-10 sm:h-11 text-base"
                  />
                </div>
              </>
            )}
            
            {(mode === 'signin' || mode === 'signup') && (
              <div className="space-y-2">
                <Label htmlFor="auth-password" className="text-sm font-medium">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-base"
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="auth-country" className="text-sm font-medium">Country</Label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger id="auth-country" className="h-10 sm:h-11 text-base">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 sm:max-h-60">
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="text-sm sm:text-base">
                        {c.name} - {c.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 sm:h-11 text-base font-medium mt-6"
              disabled={loading}
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  {mode === 'signup' && <UserPlus className="w-4 h-4 mr-2" />}
                  {mode === 'signin' && <LogIn className="w-4 h-4 mr-2" />}
                  {mode === 'forgot' && <ArrowLeft className="w-4 h-4 mr-2" />}
                  {mode === 'reset' && <Lock className="w-4 h-4 mr-2" />}
                  {mode === 'signup' ? 'Create Account' : 
                   mode === 'forgot' ? 'Send Reset Email' : 
                   mode === 'reset' ? 'Update Password' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          {mode !== 'reset' && (
            <div className="mt-4 sm:mt-6 space-y-2 text-center">
              {mode === 'forgot' ? (
                <Button
                  variant="ghost"
                  onClick={() => setMode('signin')}
                  className="text-emerald-600 hover:text-emerald-700 text-sm sm:text-base p-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to sign in
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-emerald-600 hover:text-emerald-700 text-sm sm:text-base p-2"
                  >
                    {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </Button>
                  
                  {mode === 'signin' && (
                    <Button
                      variant="ghost"
                      onClick={() => setMode('forgot')}
                      className="text-gray-600 hover:text-gray-700 text-sm sm:text-base p-2"
                    >
                      Forgot your password?
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
