
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
    console.log('🔧 AuthProvider: Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 Auth state change event:', event);
        console.log('🔔 Auth session details:', {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          metadata: session?.user?.user_metadata
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting initial session:', error);
      }
      console.log('🔧 Initial session check:', {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🔧 AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, country: string) => {
    console.log('🚀 Starting signup process...');
    console.log('📝 Signup parameters:', { email, fullName, country });
    
    const currency = countryToCurrency[country as keyof typeof countryToCurrency];
    console.log('💰 Currency mapping result:', currency);
    
    if (!currency) {
      console.error('❌ Invalid country code:', country);
      return { error: { message: 'Invalid country selected' } };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    console.log('🔗 Redirect URL:', redirectUrl);
    
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
    
    console.log('📤 Sending signup request to Supabase...');
    console.log('📋 Complete signup data:', JSON.stringify(signupData, null, 2));
    
    try {
      const { data, error } = await supabase.auth.signUp(signupData);
      
      console.log('📥 Supabase signup response:');
      console.log('✅ Data:', JSON.stringify(data, null, 2));
      
      if (error) {
        console.error('❌ Signup error details:', {
          message: error.message,
          status: error.status,
          details: error
        });
      } else {
        console.log('🎉 Signup successful!');
        console.log('👤 New user details:', {
          id: data.user?.id,
          email: data.user?.email,
          metadata: data.user?.user_metadata,
          confirmationSent: !!data.user && !data.session
        });
      }
      
      return { error };
    } catch (unexpectedError) {
      console.error('💥 Unexpected error during signup:', unexpectedError);
      return { error: { message: 'An unexpected error occurred during signup' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting signin process...', { email });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Signin error:', error);
      } else {
        console.log('✅ Signin successful');
        console.log('👤 User details:', {
          id: data.user?.id,
          email: data.user?.email
        });
      }
      
      return { error };
    } catch (unexpectedError) {
      console.error('💥 Unexpected error during signin:', unexpectedError);
      return { error: { message: 'An unexpected error occurred during signin' } };
    }
  };

  const signOut = async () => {
    console.log('🚪 Starting signout process...');
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        console.log('✅ Signout successful, redirecting...');
        window.location.href = '/auth';
      } else {
        console.error('❌ Signout error:', error);
      }
    } catch (unexpectedError) {
      console.error('💥 Unexpected error during signout:', unexpectedError);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
