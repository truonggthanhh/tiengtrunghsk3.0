import EmailPasswordForm from '@/components/auth/EmailPasswordForm';
import { supabase } from '@/cantonese/integrations/supabase/client';
export default function CantoneseEmailPasswordForm() {
  return <EmailPasswordForm client={supabase} language="cantonese" />;
}
