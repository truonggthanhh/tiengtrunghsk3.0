import { useQuery } from '@tanstack/react-query';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { LearningLanguage } from '@/lib/auth/navigation';

export function useAdminAccess(client: SupabaseClient, language: LearningLanguage, session: Session | null, isSessionLoading = false) {
  return useQuery({
    queryKey: [language, 'admin-access', session?.user.id],
    queryFn: async () => {
      const { data, error } = await client.from('profiles').select('role').eq('id', session!.user.id).maybeSingle();
      if (error) throw error;
      return data?.role === 'admin';
    },
    enabled: !isSessionLoading && Boolean(session?.user.id),
    staleTime: 15000,
    retry: false,
  });
}
