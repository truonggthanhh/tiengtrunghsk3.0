import type { ReactNode } from 'react';
import { SessionContext } from './SessionContextProvider.shared';
import { supabase } from '@/integrations/supabase/client';
import { initUserProgress } from '@/lib/initUserProgress';
import { useAuthSession } from '@/hooks/useAuthSession';

export function SessionContextProvider({ children }: { children: ReactNode }) {
  const state = useAuthSession(supabase, 'mandarin', initUserProgress);
  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}
