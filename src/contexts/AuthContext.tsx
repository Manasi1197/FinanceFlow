
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
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, country: string) => {
    const currency = countryToCurrency[country as keyof typeof countryToCurrency];
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
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
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/auth';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
