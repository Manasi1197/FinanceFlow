
import { useState, useEffect, useRef, useMemo } from 'react';
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

// Global cache to prevent multiple fetches across different hook instances
let profileCache: UserProfile | null = null;
let profilePromise: Promise<UserProfile | null> | null = null;
let lastCachedUserId: string | null = null;

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const initializedRef = useRef(false);

  // Memoize the user ID to prevent unnecessary re-renders
  const userId = useMemo(() => user?.id || null, [user?.id]);

  useEffect(() => {
    // Only log once per hook instance to reduce console noise
    if (!initializedRef.current) {
      console.log('👤 useUserProfile: Initializing for user:', {
        hasUser: !!user,
        userId: userId,
        userEmail: user?.email,
        cached: !!profileCache && lastCachedUserId === userId
      });
      initializedRef.current = true;
    }
    
    // If we have cached data for the same user, use it immediately
    if (userId === lastCachedUserId && profileCache) {
      console.log('👤 useUserProfile: Using cached profile');
      setProfile(profileCache);
      setLoading(false);
      return;
    }
    
    if (userId) {
      fetchProfile();
    } else {
      console.log('👤 useUserProfile: No user, clearing profile');
      profileCache = null;
      profilePromise = null;
      lastCachedUserId = null;
      setProfile(null);
      setLoading(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) {
      console.log('👤 fetchProfile: No user ID available');
      setLoading(false);
      return;
    }

    // If there's already a fetch in progress for this user, wait for it
    if (profilePromise && lastCachedUserId === userId) {
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

    // Only fetch if we don't have cached data for this user
    if (lastCachedUserId === userId && profileCache) {
      setProfile(profileCache);
      setLoading(false);
      return;
    }

    try {
      console.log('📥 fetchProfile: Fetching profile for user:', userId);
      setLoading(true);
      
      // Update the cached user ID immediately to prevent duplicate requests
      lastCachedUserId = userId;
      
      // Create the promise and cache it to prevent duplicate requests
      profilePromise = (async (): Promise<UserProfile | null> => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('❌ fetchProfile: Error fetching profile:', {
            message: error.message,
            code: error.code
          });
          
          // If no profile exists, that might be expected for new users
          if (error.code === 'PGRST116') {
            console.log('ℹ️ fetchProfile: No profile found (this might be expected for new users)');
          }
          return null;
        } else {
          console.log('✅ fetchProfile: Profile loaded successfully');
          profileCache = data;
          return data;
        }
      })();

      const result = await profilePromise;
      setProfile(result);
    } catch (error) {
      console.error('💥 fetchProfile: Unexpected error:', error);
      setProfile(null);
      // Reset cache on error
      profileCache = null;
      lastCachedUserId = null;
    } finally {
      setLoading(false);
      profilePromise = null; // Clear the promise after completion
    }
  };

  const refetch = async () => {
    profileCache = null; // Clear cache to force refetch
    profilePromise = null;
    lastCachedUserId = null;
    await fetchProfile();
  };

  return { profile, loading, refetch };
};
