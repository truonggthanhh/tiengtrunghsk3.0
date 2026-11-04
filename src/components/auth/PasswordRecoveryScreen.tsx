import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authErrorMessage } from '@/lib/auth/errors';
import type { LearningLanguage } from '@/lib/auth/navigation';

export default function PasswordRecoveryScreen({ client, language, update = false, session, isLoading }: { client: SupabaseClient; language: LearningLanguage; update?: boolean; session: Session | null; isLoading: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const busy = useRef(false);
  const navigate = useNavigate();
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy.current) return;
    setError(''); setMessage('');
    if (update && (password.length < 8 || password !== confirmation)) { setError(password.length < 8 ? 'Mật khẩu mới cần ít nhất 8 ký tự.' : 'Mật khẩu xác nhận không khớp.'); return; }
    if (update && !session) { setError('Liên kết đã hết hạn. Hãy yêu cầu một liên kết mới.'); return; }
    busy.current = true; setPending(true);
    try {
      const result = update ? await client.auth.updateUser({ password }) : await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/${language}/update-password` });
      if (result.error) throw result.error;
      if (update) navigate(`/${language}/profile`, { replace: true });
      else setMessage('Nếu email này có tài khoản, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu. Hãy kiểm tra cả thư mục spam.');
    } catch (failure) { setError(authErrorMessage(failure)); }
    finally { busy.current = false; setPending(false); }
  }
  return <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
    <Link to={`/${language}/login`} className="mb-6 text-sm text-primary hover:underline">← Quay về đăng nhập</Link>
    <h1 className="mb-3 text-2xl font-bold">{update ? 'Đặt mật khẩu mới' : 'Quên mật khẩu'}</h1>
    <p className="mb-6 text-sm text-muted-foreground">{update ? 'Chọn mật khẩu mới gồm ít nhất 8 ký tự.' : 'Nhập email bạn đã dùng để đăng ký tài khoản.'}</p>
    {update && isLoading ? <p role="status">Đang kiểm tra liên kết…</p> : update && !session ? <div role="alert" className="space-y-4 rounded-xl border p-4"><p>Liên kết không hợp lệ hoặc đã hết hạn.</p><Button asChild><Link to={`/${language}/forgot-password`}>Gửi liên kết mới</Link></Button></div> : <form onSubmit={submit} className="space-y-4" aria-busy={pending}>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-emerald-500/10 p-3 text-sm">{message}</p>}
      <fieldset disabled={pending} className="space-y-4">
        {update ? <><div className="space-y-2"><Label htmlFor="new-password">Mật khẩu mới</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="confirm-password">Nhập lại mật khẩu</Label><Input id="confirm-password" type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></div></> : <div className="space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" type="email" autoComplete="email" autoCapitalize="none" required value={email} onChange={e => setEmail(e.target.value)} /></div>}
        <Button type="submit" className="w-full">{pending ? 'Đang xử lý…' : update ? 'Lưu mật khẩu mới' : 'Gửi liên kết đặt lại'}</Button>
      </fieldset>
    </form>}
  </main>;
}
