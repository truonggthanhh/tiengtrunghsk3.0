import { createContext,useContext } from 'react';
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

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
