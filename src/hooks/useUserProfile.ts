
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  country: string;
  currency_code: string;
  currency_symbol: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log('👤 useUserProfile: User changed:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email
    });
    
    if (user) {
      fetchProfile();
    } else {
      console.log('👤 useUserProfile: No user, clearing profile');
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) {
      console.log('👤 fetchProfile: No user ID available');
      setLoading(false);
      return;
    }

    try {
      console.log('📥 fetchProfile: Fetching profile for user:', user.id);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('📊 fetchProfile: Query result:', {
        hasData: !!data,
        error: error?.message,
        data: data
      });

      if (error) {
        console.error('❌ fetchProfile: Error fetching profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If no profile exists, that might be expected for new users
        if (error.code === 'PGRST116') {
          console.log('ℹ️ fetchProfile: No profile found (this might be expected for new users)');
        }
      } else {
        console.log('✅ fetchProfile: Profile loaded successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('💥 fetchProfile: Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, refetch: fetchProfile };
};
