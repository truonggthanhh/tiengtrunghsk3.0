import { useContext } from 'react';
import { SessionContext as MandarinContext } from '@/components/SessionContextProvider.shared';
import { SessionContext as CantoneseContext } from '@/cantonese/components/providers/SessionContextProvider.shared';
import { supabase as mandarinClient } from '@/integrations/supabase/client';
import { supabase as cantoneseClient } from '@/cantonese/integrations/supabase/client';
import type { LearningLanguage } from '@/lib/auth/navigation';

export function useLearningSession(language: LearningLanguage) {
  const mandarin = useContext(MandarinContext);
  const cantonese = useContext(CantoneseContext);
  return (language === 'mandarin' ? mandarin : cantonese) ?? { session: null, isLoading: false, error: null };
}
export function learningClient(language: LearningLanguage) { return language === 'mandarin' ? mandarinClient : cantoneseClient; }
