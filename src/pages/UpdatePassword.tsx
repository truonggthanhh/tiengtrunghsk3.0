import PasswordRecoveryScreen from '@/components/auth/PasswordRecoveryScreen';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider.shared';
export default function UpdatePassword() {
  const { session, isLoading } = useSession();
  return <PasswordRecoveryScreen client={supabase} language="mandarin" session={session} isLoading={isLoading} update={true} />;
}
