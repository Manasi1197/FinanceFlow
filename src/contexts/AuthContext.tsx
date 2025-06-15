
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, country: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const countryToCurrency = {
  'US': { code: 'USD', symbol: '$' },
  'UK': { code: 'GBP', symbol: '£' },
  'CA': { code: 'CAD', symbol: 'C$' },
  'AU': { code: 'AUD', symbol: 'A$' },
  'DE': { code: 'EUR', symbol: '€' },
  'FR': { code: 'EUR', symbol: '€' },
  'JP': { code: 'JPY', symbol: '¥' },
  'IN': { code: 'INR', symbol: '₹' },
  'BR': { code: 'BRL', symbol: 'R$' },
  'MX': { code: 'MXN', symbol: '$' },
  'ES': { code: 'EUR', symbol: '€' },
  'IT': { code: 'EUR', symbol: '€' },
  'NL': { code: 'EUR', symbol: '€' },
  'SE': { code: 'SEK', symbol: 'kr' },
  'NO': { code: 'NOK', symbol: 'kr' },
  'DK': { code: 'DKK', symbol: 'kr' },
  'CH': { code: 'CHF', symbol: 'CHF' },
  'SG': { code: 'SGD', symbol: 'S$' },
  'HK': { code: 'HKD', symbol: 'HK$' },
  'ZA': { code: 'ZAR', symbol: 'R' }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, country: string) => {
    console.log('Starting signup process...', { email, fullName, country });
    
    const currency = countryToCurrency[country as keyof typeof countryToCurrency];
    console.log('Currency mapping:', currency);
    
    if (!currency) {
      console.error('Invalid country code:', country);
      return { error: { message: 'Invalid country selected' } };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    console.log('Redirect URL:', redirectUrl);
    
    const signupData = {
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          country: country,
          currency_code: currency.code,
          currency_symbol: currency.symbol
        }
      }
    };
    
    console.log('Signup data being sent:', JSON.stringify(signupData, null, 2));
    
    const { error } = await supabase.auth.signUp(signupData);
    
    if (error) {
      console.error('Signup error:', error);
    } else {
      console.log('Signup successful');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Starting signin process...', { email });
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Signin error:', error);
    } else {
      console.log('Signin successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('Starting signout process...');
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/auth';
    } else {
      console.error('Signout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
