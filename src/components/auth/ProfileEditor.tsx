import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { authErrorMessage } from '@/lib/auth/errors';
import type { LearningLanguage } from '@/lib/auth/navigation';

interface Profile { first_name: string | null; last_name: string | null; avatar_url?: string | null; }
export default function ProfileEditor({ client, language, session, profile }: { client: SupabaseClient; language: LearningLanguage; session: Session; profile: Profile }) {
  const [first, setFirst] = useState(profile.first_name ?? '');
  const [last, setLast] = useState(profile.last_name ?? '');
  const [avatar, setAvatar] = useState(profile.avatar_url ?? '');
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const busy = useRef(false);
  const queryClient = useQueryClient();
  useEffect(() => { if (!dirty) { setFirst(profile.first_name ?? ''); setLast(profile.last_name ?? ''); setAvatar(profile.avatar_url ?? ''); } }, [dirty, profile.first_name, profile.last_name, profile.avatar_url]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy.current || !dirty) return;
    setError(''); setSaved(false);
    if (avatar.trim()) {
      try { if (!['https:', 'http:'].includes(new URL(avatar.trim()).protocol)) throw new Error(); }
      catch { setError('Ảnh đại diện cần là liên kết http hoặc https hợp lệ.'); return; }
    }
    busy.current = true; setPending(true);
    try {
      const { data: auth, error: authError } = await client.auth.getUser();
      if (authError || auth.user?.id !== session.user.id) throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng tải lại trang.');
      const values = { first_name: first.trim(), last_name: last.trim(), ...('avatar_url' in profile ? { avatar_url: avatar.trim() || null } : {}) };
      const { data, error: responseError } = await client.from('profiles').update(values).eq('id', session.user.id).select('id').maybeSingle();
      if (responseError) throw responseError;
      if (!data) throw new Error('Chưa lưu được hồ sơ. Vui lòng kiểm tra quyền truy cập hoặc thử lại.');
      await queryClient.invalidateQueries({ queryKey: [language, 'current-profile', session.user.id] });
      setDirty(false); setSaved(true);
    } catch (failure) { setError(authErrorMessage(failure)); }
    finally { busy.current = false; setPending(false); }
  }
  return <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-5" aria-busy={pending}>
    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{saved && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">Đã lưu thông tin cá nhân.</p>}
    <fieldset disabled={pending} className="space-y-4">
      <div className="space-y-2"><Label htmlFor="profile-email">Email</Label><Input id="profile-email" value={session.user.email ?? ''} disabled /></div>
      <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="profile-last">Họ</Label><Input id="profile-last" autoComplete="family-name" maxLength={80} value={last} onChange={event => { setLast(event.target.value); setDirty(true); setSaved(false); }} /></div><div className="space-y-2"><Label htmlFor="profile-first">Tên</Label><Input id="profile-first" autoComplete="given-name" maxLength={80} value={first} onChange={event => { setFirst(event.target.value); setDirty(true); setSaved(false); }} /></div></div>
      {'avatar_url' in profile && <div className="space-y-2"><Label htmlFor="profile-avatar">Liên kết ảnh đại diện</Label><Input id="profile-avatar" type="url" maxLength={2048} value={avatar} onChange={event => { setAvatar(event.target.value); setDirty(true); setSaved(false); }} placeholder="https://…" /></div>}
      <Button type="submit" disabled={!dirty}>{pending ? 'Đang lưu…' : 'Lưu thông tin'}</Button>
    </fieldset>
  </form>;
}
