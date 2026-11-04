import LoginScreen from '@/components/auth/LoginScreen';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider.shared';
export default function Login() {
  const { session, isLoading, error } = useSession();
  return <LoginScreen client={supabase} language="cantonese" session={session} isLoading={isLoading} sessionError={error} />;
}
