import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { learningClient } from '@/hooks/useLearningSession';
import { authErrorMessage } from '@/lib/auth/errors';
import type { LearningLanguage } from '@/lib/auth/navigation';

export function useSignOut(language: LearningLanguage) {
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const navigate = useNavigate();
  async function signOut() {
    if (busy.current) return;
    busy.current = true; setPending(true);
    try {
      const { error } = await learningClient(language).auth.signOut();
      if (error) throw error;
      toast.success('Đã đăng xuất.');
      navigate(`/${language}`, { replace: true });
    } catch (failure) { toast.error(authErrorMessage(failure)); }
    finally { busy.current = false; setPending(false); }
  }
  return { signOut, pending };
}
