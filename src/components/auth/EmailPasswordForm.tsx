import PolicyAcknowledgement from './PolicyAcknowledgement';
import { emptyPolicyChoice, acceptedPolicy } from '@/lib/policyConsent';
import { legalVersion } from '@/data/legal/policies';
import { authErrorMessage } from '@/lib/auth/errors';
import { useRef, useState, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { safeReturnPath, type LearningLanguage } from '@/lib/auth/navigation';
import { toError } from '@/lib/errors';


export default function EmailPasswordForm({ client, language, returnUrl }: { client: SupabaseClient; language: LearningLanguage; returnUrl?: string }) {
  const [policyChoice, setPolicyChoice] = useState(emptyPolicyChoice);
  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const busy = useRef(false);
  const target = safeReturnPath(returnUrl, language);
  const redirectTo = `${window.location.origin}${target}`;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy.current) return;
    setError(''); setMessage(''); setCanResend(false);
    if (!email.trim() || !password) { setError('Vui lòng nhập email và mật khẩu.'); return; }
    if (signUp && password.length < 8) { setError('Mật khẩu mới cần ít nhất 8 ký tự.'); return; }
    if (signUp && password !== confirmation) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (signUp && !acceptedPolicy(policyChoice)) { setError('Vui lòng xác nhận độ tuổi, điều khoản và lựa chọn xử lý dữ liệu trước khi đăng ký.'); return; }
    busy.current = true; setPending(true);
    try {
      if (signUp) {
        const { data, error: responseError } = await client.auth.signUp({ email: email.trim(), password,
          options: { emailRedirectTo: redirectTo, data: { first_name: name.trim(), legal_acknowledgement: { version: legalVersion, accepted_at: new Date().toISOString(), terms: true, processing: true, age_16_plus: true } } } });
        if (responseError) throw responseError;
        if (data.user?.identities?.length === 0) throw new Error('User already registered');
        if (!data.session) {
          setMessage('Đăng ký thành công. Hãy mở email để xác nhận tài khoản trước khi đăng nhập.');
          setCanResend(true); setSignUp(false); setPassword(''); setConfirmation('');
        } else setMessage('Tài khoản đã sẵn sàng. Đang chuyển đến trang học…');
      } else {
        const { error: responseError } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (responseError) throw responseError;
        setMessage('Đăng nhập thành công. Đang chuyển đến trang học…');
      }
    } catch (failure) {
      setError(authErrorMessage(failure));
      setCanResend(/email not confirmed/i.test(toError(failure).message));
    } finally { busy.current = false; setPending(false); }
  }
  async function resend() {
    if (busy.current || !email.trim()) return;
    busy.current = true; setPending(true); setError('');
    try {
      const { error: responseError } = await client.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: redirectTo } });
      if (responseError) throw responseError;
      setMessage('Đã gửi lại hướng dẫn xác nhận. Hãy kiểm tra cả thư mục spam.');
    } catch (failure) { setError(authErrorMessage(failure)); }
    finally { busy.current = false; setPending(false); }
  }
  return <form onSubmit={submit} className="space-y-4" aria-busy={pending}>
    <div className="grid grid-cols-2 gap-2" aria-label="Chế độ tài khoản">
      <Button type="button" variant={!signUp ? 'default' : 'outline'} disabled={pending} aria-pressed={!signUp} onClick={() => { setSignUp(false); setError(''); setMessage(''); }}>Đăng nhập</Button>
      <Button type="button" variant={signUp ? 'default' : 'outline'} disabled={pending} aria-pressed={signUp} onClick={() => { setSignUp(true); setError(''); setMessage(''); }}>Tạo tài khoản</Button>
    </div>
    {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {message && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">{message}</p>}
    <fieldset disabled={pending} className="space-y-4">
      {signUp && <div className="space-y-2"><Label htmlFor="auth-name">Tên hiển thị</Label><Input id="auth-name" autoComplete="given-name" maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Bạn muốn được gọi là gì?" /></div>}
      <div className="space-y-2"><Label htmlFor="auth-email">Email</Label><Input id="auth-email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="ban@example.com" /></div>
      <div className="space-y-2"><Label htmlFor="auth-password">Mật khẩu</Label><div className="relative"><Input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={signUp ? 'new-password' : 'current-password'} required minLength={signUp ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} className="pr-12" />
        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-0" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>
        {signUp && <p className="text-xs text-muted-foreground">Tối thiểu 8 ký tự; nên kết hợp chữ, số và ký hiệu.</p>}</div>
      {signUp && <div className="space-y-2"><Label htmlFor="auth-confirmation">Nhập lại mật khẩu</Label><Input id="auth-confirmation" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></div>}
      {signUp && <PolicyAcknowledgement language={language} prefix="signup-policy" value={policyChoice} onChange={setPolicyChoice} />}
      <Button type="submit" className="w-full">{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{pending ? 'Đang xử lý…' : signUp ? 'Đăng ký tài khoản' : 'Đăng nhập bằng email'}</Button>
    </fieldset>
    {canResend && <Button type="button" variant="outline" className="w-full" disabled={pending} onClick={resend}>Gửi lại email xác nhận</Button>}
    {!signUp && <Link to={`/${language}/forgot-password`} className="block text-center text-sm text-primary underline underline-offset-4">Quên mật khẩu?</Link>}
  </form>;
}
