import PasswordRecoveryScreen from '@/components/auth/PasswordRecoveryScreen';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider.shared';
export default function UpdatePassword() {
  const { session, isLoading } = useSession();
  return <PasswordRecoveryScreen client={supabase} language="cantonese" session={session} isLoading={isLoading} update={true} />;
}
