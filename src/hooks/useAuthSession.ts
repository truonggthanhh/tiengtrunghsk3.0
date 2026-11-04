import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { cleanAuthUrl, isLanguageQuery, type LearningLanguage } from '@/lib/auth/navigation';
import { toError } from '@/lib/errors';

const knownSessions = new WeakMap<SupabaseClient, string | null>();

export function useAuthSession(client: SupabaseClient, language: LearningLanguage, initialize: (userId: string) => Promise<void>) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<{ session: Session | null; isLoading: boolean; error: string | null }>({ session: null, isLoading: true, error: null });
  useEffect(() => {
    let active = true;
    let revision = 0;
    let currentUser: string | null | undefined;
    let initialized: string | null = null;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const apply = (session: Session | null) => {
      if (!active) return;
      const nextUser = session?.user.id ?? null;
      const previousUser = currentUser === undefined ? knownSessions.get(client) : currentUser;
      if (previousUser !== undefined && previousUser !== nextUser) {
        queryClient.removeQueries({ predicate: query => isLanguageQuery(query.queryKey, language) });
      }
      currentUser = nextUser;
      knownSessions.set(client, nextUser);
      setState({ session, isLoading: false, error: null });
      if (session) {
        const clean = cleanAuthUrl(window.location.href);
        if (clean !== window.location.pathname + window.location.search + window.location.hash) window.history.replaceState(window.history.state, '', clean);
        if (initialized !== nextUser) {
          initialized = nextUser;
          // Leave Supabase's auth callback before making another SDK request.
          const timer = setTimeout(() => { timers.delete(timer); if (active && currentUser === nextUser) void initialize(nextUser!); }, 0);
          timers.add(timer);
        }
      } else { initialized = null; }
    };
    const timeout = setTimeout(() => {
      if (active && revision === 0) {
        revision++;
        setState({ session: null, isLoading: false, error: 'Không thể kiểm tra phiên đăng nhập. Vui lòng tải lại trang.' });
      }
    }, 10000);
    const initialRevision = revision;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      revision++;
      clearTimeout(timeout);
      apply(session);
    });
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (!active || revision !== initialRevision) return;
      clearTimeout(timeout);
      if (error) setState({ session: null, isLoading: false, error: toError(error).message });
      else apply(session);
    }).catch(error => {
      if (active && revision === initialRevision) { clearTimeout(timeout); setState({ session: null, isLoading: false, error: toError(error).message }); }
    });
    return () => { active = false; clearTimeout(timeout); for (const timer of timers) clearTimeout(timer); subscription.unsubscribe(); };
  }, [client, language, initialize, queryClient]);
  return state;
}
