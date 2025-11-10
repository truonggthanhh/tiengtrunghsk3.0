"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from './SessionContextProvider';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
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
      setIsLoadingProfile(true);
      setProfile(null);
      setIsAdmin(false);

      if (session?.user) {
        // Lấy thông tin hồ sơ và vai trò một cách song song
        const profilePromise = supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, role')
          .eq('id', session.user.id)
          .maybeSingle();

        // Gọi trực tiếp hàm RPC 'get_my_role' để có nguồn xác thực vai trò cuối cùng
        const rolePromise = supabase.rpc('get_my_role');

        const [profileResult, roleResult] = await Promise.all([profilePromise, rolePromise]);

        // Xử lý dữ liệu hồ sơ
        if (profileResult.error) {
          console.error('ProfileProvider: Lỗi khi lấy hồ sơ:', profileResult.error);
        } else if (profileResult.data) {
          setProfile(profileResult.data as Profile);
        } else if (!profileResult.data && session.user) {
          // Profile không tồn tại, tạo profile mặc định từ user metadata
          console.log('ProfileProvider: Profile không tồn tại, tạo từ user metadata');

          const userMetadata = session.user.user_metadata || {};
          const email = session.user.email || '';

          // Tạo profile từ metadata hoặc email
          const defaultProfile: Profile = {
            id: session.user.id,
            first_name: userMetadata.first_name || userMetadata.full_name?.split(' ')[0] || email.split('@')[0] || 'User',
            last_name: userMetadata.last_name || userMetadata.full_name?.split(' ').slice(1).join(' ') || '',
            avatar_url: userMetadata.avatar_url || userMetadata.picture || null,
            role: 'user'
          };

          // Cố gắng insert profile vào database
          try {
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
              console.error('ProfileProvider: Lỗi khi tạo profile:', insertError);
            } else {
              console.log('ProfileProvider: Đã tạo profile thành công');
            }
          } catch (err) {
            console.error('ProfileProvider: Exception khi tạo profile:', err);
          }

          // Set profile ngay lập tức (không chờ insert)
          setProfile(defaultProfile);
        }

        // Xử lý dữ liệu vai trò và đặt trạng thái admin
        if (roleResult.error) {
          console.error('ProfileProvider: Lỗi khi gọi RPC get_my_role:', roleResult.error);
          setIsAdmin(false); // Mặc định là false khi có lỗi
        } else {
          // Lệnh gọi RPC là nguồn xác thực duy nhất cho việc có phải là admin hay không
          setIsAdmin(roleResult.data === 'admin');
        }

      }
      setIsLoadingProfile(false);
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