import PolicyAcknowledgement from './PolicyAcknowledgement';
import { emptyPolicyChoice, acceptedPolicy } from '@/lib/policyConsent';
import LegalLinks from '@/components/LegalLinks';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmailPasswordForm from './EmailPasswordForm';
import { safeReturnPath, type LearningLanguage } from '@/lib/auth/navigation';
import { authErrorMessage } from '@/lib/auth/errors';

export default function LoginScreen({ client, language, session, isLoading, sessionError }: { client: SupabaseClient; language: LearningLanguage; session: Session | null; isLoading: boolean; sessionError?: string | null }) {
  const { search } = useLocation();
  const navigate = useNavigate();
  const target = safeReturnPath(new URLSearchParams(search).get('returnUrl'), language, language === 'cantonese' ? '/cantonese/lessons' : '/mandarin');
  const [googlePolicyOpen, setGooglePolicyOpen] = useState(false);
  const [googlePolicy, setGooglePolicy] = useState(emptyPolicyChoice);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  useEffect(() => { if (!isLoading && session) navigate(target, { replace: true }); }, [isLoading, session, navigate, target]);
  if (isLoading || session) return <div role="status" className="flex min-h-[60vh] items-center justify-center gap-3"><Loader2 className="h-5 w-5 animate-spin" />Đang kiểm tra phiên đăng nhập…</div>;
  async function google() {
    if (busy.current) return;
    if (!acceptedPolicy(googlePolicy)) { setGooglePolicyOpen(true); setError('Trước khi tiếp tục với Google, vui lòng xác nhận độ tuổi, điều khoản và lựa chọn xử lý dữ liệu.'); return; }
    busy.current = true; setPending(true); setError('');
    try {
      const { error: responseError } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}${target}` } });
      if (responseError) throw responseError;
    } catch (failure) { setError(authErrorMessage(failure)); }
    finally { busy.current = false; setPending(false); }
  }
  return <main className="flex min-h-[85vh] items-center justify-center bg-gradient-to-br from-violet-50 via-background to-cyan-50 px-4 py-10 dark:from-violet-950/20 dark:to-cyan-950/20">
    <div className="grid w-full max-w-4xl items-center gap-10 md:grid-cols-2">
      <section className="space-y-5"><Link to={`/${language}`} className="text-sm text-primary hover:underline">← Quay về trang chủ</Link>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpen className="h-8 w-8" /></div>
        <h1 className="text-3xl font-bold tracking-tight">Học {language === 'mandarin' ? 'tiếng Trung' : 'tiếng Quảng Đông'} theo nhịp của bạn</h1>
        <p className="text-muted-foreground">Đăng nhập để lưu tiến độ và tiếp tục bài học đang dở.</p>
        <ul className="space-y-3 text-sm">{['Sổ từ cá nhân và ôn lại từ đã lưu', 'Bài học, flashcard và luyện phát âm', 'Quay lại đúng trang sau khi đăng nhập'].map(text => <li key={text} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{text}</li>)}</ul>
      </section>
      <Card className="rounded-2xl shadow-xl"><CardHeader><CardTitle>Chào mừng bạn trở lại</CardTitle><CardDescription>Email hoặc Google — chọn cách đăng nhập thuận tiện.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          {(sessionError || error) && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{sessionError || error}</p>}
          <fieldset disabled={pending}><EmailPasswordForm client={client} language={language} returnUrl={target} /></fieldset>
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><hr className="flex-1" />HOẶC<hr className="flex-1" /></div>
          {googlePolicyOpen && <fieldset disabled={pending}><PolicyAcknowledgement language={language} prefix="google-policy" value={googlePolicy} onChange={setGooglePolicy} /></fieldset>}
          <Button type="button" variant="outline" className="w-full" disabled={pending} onClick={google}>{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Tiếp tục với Google</Button>
          <p className="text-xs leading-6 text-muted-foreground">Đăng nhập Google có thể chia sẻ email, tên và ảnh đại diện với hệ thống xác thực. Hãy đọc thông báo xử lý dữ liệu trước khi tiếp tục.</p><LegalLinks language={language} />
        </CardContent>
      </Card>
    </div>
  </main>;
}
