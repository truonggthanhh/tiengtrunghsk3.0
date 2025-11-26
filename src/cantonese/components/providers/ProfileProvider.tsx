"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from './SessionContextProvider';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role?: 'user' | 'admin';
  is_admin?: boolean;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoadingProfile: boolean;
  isAdmin: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export default function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoading: isLoadingSession } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    async function getProfileAndRole() {
      console.log('[ProfileProvider] Starting - Session:', session ? `✓ User: ${session.user.email}` : '✗ No session');
      setIsLoadingProfile(true);

      // Add timeout to prevent infinite loading (10 seconds max)
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn('[ProfileProvider] ⏱️ Timeout: Profile loading took too long, falling back to default state');
          setProfile(null);
          setIsAdmin(false);
          setIsLoadingProfile(false);
        }
      }, 10000);

      if (!session?.user) {
        console.log('[ProfileProvider] No session, clearing profile state');
        clearTimeout(timeoutId);
        setProfile(null);
        setIsAdmin(false);
        setIsLoadingProfile(false);
        return;
      }

      try {
        // Fetch profile - Cantonese only has 'role' column (no is_admin)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('[ProfileProvider] ❌ Error fetching profile:', profileError);
          console.warn('[ProfileProvider] ⚠️ Continuing without profile data (app will still work)');
          clearTimeout(timeoutId);
          setProfile(null);
          setIsAdmin(false);
          setIsLoadingProfile(false);
          return;
        }

        let finalProfile: Profile | null = null;

        if (profileData) {
          // Cantonese uses only 'role' column (no is_admin)
          const computedRole = profileData.role || 'user';
          console.log('[ProfileProvider] ✓ Profile found:', {
            name: `${profileData.first_name} ${profileData.last_name}`,
            role: profileData.role,
            computed: computedRole
          });
          finalProfile = { ...profileData, role: computedRole } as Profile;
          setProfile(finalProfile);
        } else {
          // Profile doesn't exist, create default
          console.log('[ProfileProvider] Profile not found, creating default...');

          const userMetadata = session.user.user_metadata || {};
          const email = session.user.email || '';

          const defaultProfile: Profile = {
            id: session.user.id,
            first_name: userMetadata.first_name || userMetadata.full_name?.split(' ')[0] || email.split('@')[0] || 'User',
            last_name: userMetadata.last_name || userMetadata.full_name?.split(' ').slice(1).join(' ') || '',
            avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
            role: 'user'
          };

          // Try to insert profile (Cantonese schema - no is_admin column)
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              first_name: defaultProfile.first_name,
              last_name: defaultProfile.last_name,
              avatar_url: defaultProfile.avatar_url,
              role: 'user'
            });

          if (insertError) {
            console.error('[ProfileProvider] ❌ Error creating profile:', insertError);
            console.warn('[ProfileProvider] ⚠️ Continuing without profile creation (app will still work)');
          } else {
            console.log('[ProfileProvider] ✓ Profile created');
          }

          finalProfile = defaultProfile;
          setProfile(defaultProfile);
        }

        // Determine admin status - check role column only (Cantonese has no is_admin)
        let adminStatus = finalProfile?.role === 'admin';
        console.log('[ProfileProvider] Admin status from profile:', { role: finalProfile?.role, result: adminStatus });

        // Try RPC as additional verification (non-critical if it fails)
        try {
          const { data: roleData, error: roleError } = await supabase.rpc('get_my_role');
          if (!roleError && roleData) {
            const rpcAdminStatus = roleData === 'admin';
            console.log('[ProfileProvider] ✓ RPC role check:', roleData, '→', rpcAdminStatus);
            adminStatus = rpcAdminStatus;
          } else if (roleError) {
            console.warn('[ProfileProvider] ⚠ RPC get_my_role failed (using profile.role fallback):', roleError.message);
          }
        } catch (rpcError) {
          console.warn('[ProfileProvider] ⚠ RPC exception (using profile.role fallback):', rpcError);
        }

        setIsAdmin(adminStatus);
        console.log('[ProfileProvider] ✓ Final state - Profile:', !!finalProfile, 'Admin:', adminStatus);

      } catch (err) {
        console.error('[ProfileProvider] ❌ Unexpected error:', err);
        console.warn('[ProfileProvider] ⚠️ Continuing without profile data (app will still work)');
        clearTimeout(timeoutId);
        setProfile(null);
        setIsAdmin(false);
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    if (!isLoadingSession) {
      getProfileAndRole();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [session, isLoadingSession]);

  return (
    <ProfileContext.Provider value={{ profile, isLoadingProfile, isAdmin }}>
      {children}
    </ProfileContext.Provider>
  );
}