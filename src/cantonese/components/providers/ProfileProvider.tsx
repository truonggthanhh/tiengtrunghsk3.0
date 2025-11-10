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
    async function getProfileAndRole() {
      console.log('[ProfileProvider] Starting - Session:', session ? `✓ User: ${session.user.email}` : '✗ No session');
      setIsLoadingProfile(true);

      if (!session?.user) {
        console.log('[ProfileProvider] No session, clearing profile state');
        setProfile(null);
        setIsAdmin(false);
        setIsLoadingProfile(false);
        return;
      }

      try {
        // Fetch profile - try to get both is_admin and role columns for compatibility
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, is_admin, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('[ProfileProvider] ❌ Error fetching profile:', profileError);
          setProfile(null);
          setIsAdmin(false);
          setIsLoadingProfile(false);
          return;
        }

        let finalProfile: Profile | null = null;

        if (profileData) {
          // Determine role from either is_admin or role column
          const computedRole = profileData.is_admin ? 'admin' : (profileData.role || 'user');
          console.log('[ProfileProvider] ✓ Profile found:', {
            name: `${profileData.first_name} ${profileData.last_name}`,
            is_admin: profileData.is_admin,
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
            role: 'user',
            is_admin: false
          };

          // Try to insert profile (compatible with both schemas)
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              first_name: defaultProfile.first_name,
              last_name: defaultProfile.last_name,
              avatar_url: defaultProfile.avatar_url,
              is_admin: false
            });

          if (insertError) {
            console.error('[ProfileProvider] ❌ Error creating profile:', insertError);
          } else {
            console.log('[ProfileProvider] ✓ Profile created');
          }

          finalProfile = defaultProfile;
          setProfile(defaultProfile);
        }

        // Determine admin status - check is_admin first, then role, then RPC
        let adminStatus = finalProfile?.is_admin === true || finalProfile?.role === 'admin';
        console.log('[ProfileProvider] Admin status from profile:', { is_admin: finalProfile?.is_admin, role: finalProfile?.role, result: adminStatus });

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
        setProfile(null);
        setIsAdmin(false);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    if (!isLoadingSession) {
      getProfileAndRole();
    }
  }, [session, isLoadingSession]);

  return (
    <ProfileContext.Provider value={{ profile, isLoadingProfile, isAdmin }}>
      {children}
    </ProfileContext.Provider>
  );
}