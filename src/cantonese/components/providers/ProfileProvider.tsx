import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ProfileContext } from './ProfileProvider.shared';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from './SessionContextProvider.shared';

export default function ProfileProvider({ children }: { children: ReactNode }) {
  const { session, isLoading } = useSession();
  const profile = useQuery({
    queryKey: ['cantonese', 'current-profile', session?.user.id],
    enabled: !isLoading && Boolean(session),
    retry: false,
    staleTime: 30000,
    queryFn: async ({ signal }) => {
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal.addEventListener('abort', abort, { once: true });
      const timer = setTimeout(abort, 10000);
      try {
        const { data, error } = await supabase.from('profiles').select('id, first_name, last_name, avatar_url, role').eq('id', session!.user.id).abortSignal(controller.signal).maybeSingle();
        if (error) throw error;
        if (!data) return null;
        return { ...data, role: data.role === 'admin' ? 'admin' as const : 'user' as const };
      } finally { clearTimeout(timer); signal.removeEventListener('abort', abort); }
    },
  });
  return <ProfileContext.Provider value={{ profile: profile.data ?? null, isLoadingProfile: isLoading || profile.isLoading, isAdmin: profile.data?.role === 'admin' }}>{children}</ProfileContext.Provider>;
}
