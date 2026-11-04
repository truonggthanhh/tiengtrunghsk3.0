import LoginScreen from '@/components/auth/LoginScreen';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider.shared';
export default function Login() {
  const { session, isLoading, error } = useSession();
  return <LoginScreen client={supabase} language="mandarin" session={session} isLoading={isLoading} sessionError={error} />;
}
