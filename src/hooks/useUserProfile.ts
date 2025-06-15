
import { useState, useEffect, useRef } from 'react';
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

// Cache to prevent multiple fetches
let profileCache: UserProfile | null = null;
let profilePromise: Promise<UserProfile | null> | null = null;

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(profileCache);
  const [loading, setLoading] = useState(!profileCache);
  const { user } = useAuth();
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('👤 useUserProfile: User changed:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      cached: !!profileCache,
      sameUser: lastUserIdRef.current === user?.id
    });
    
    // If it's the same user and we have cached data, don't refetch
    if (user?.id === lastUserIdRef.current && profileCache) {
      console.log('👤 useUserProfile: Using cached profile');
      setProfile(profileCache);
      setLoading(false);
      return;
    }
    
    if (user) {
      lastUserIdRef.current = user.id;
      fetchProfile();
    } else {
      console.log('👤 useUserProfile: No user, clearing profile');
      profileCache = null;
      profilePromise = null;
      lastUserIdRef.current = null;
      setProfile(null);
      setLoading(false);
    }
  }, [user?.id]); // Only depend on user ID, not the entire user object

  const fetchProfile = async () => {
    if (!user?.id) {
      console.log('👤 fetchProfile: No user ID available');
      setLoading(false);
      return;
    }

    // If there's already a fetch in progress for this user, wait for it
    if (profilePromise) {
      console.log('👤 fetchProfile: Waiting for existing fetch to complete');
      try {
        const cachedProfile = await profilePromise;
        setProfile(cachedProfile);
        setLoading(false);
        return;
      } catch (error) {
        console.error('👤 fetchProfile: Error waiting for existing fetch:', error);
      }
    }

    try {
      console.log('📥 fetchProfile: Fetching profile for user:', user.id);
      setLoading(true);
      
      // Create the promise and cache it to prevent duplicate requests
      profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
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
            return null;
          } else {
            console.log('✅ fetchProfile: Profile loaded successfully:', data);
            profileCache = data;
            return data;
          }
        });

      const result = await profilePromise;
      setProfile(result);
    } catch (error) {
      console.error('💥 fetchProfile: Unexpected error:', error);
      setProfile(null);
    } finally {
      setLoading(false);
      profilePromise = null; // Clear the promise after completion
    }
  };

  const refetch = async () => {
    profileCache = null; // Clear cache to force refetch
    profilePromise = null;
    await fetchProfile();
  };

  return { profile, loading, refetch };
};
