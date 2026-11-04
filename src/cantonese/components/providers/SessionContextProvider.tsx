import type { ReactNode } from 'react';
import { SessionContext } from './SessionContextProvider.shared';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { initUserProgress } from '@/cantonese/lib/initUserProgress';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function SessionContextProvider({ children }: { children: ReactNode }) {
  const state = useAuthSession(supabase, 'cantonese', initUserProgress);
  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}
