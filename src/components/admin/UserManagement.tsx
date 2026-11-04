import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { learningClient, useLearningSession } from '@/hooks/useLearningSession';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { isFullUserId, userDisplayName, userNameFilter, type ManagedUser } from '@/lib/adminUsers';
import type { LearningLanguage } from '@/lib/auth/navigation';

const PAGE_SIZE = 20;
interface Props { language: LearningLanguage; renderActions?: (user: ManagedUser) => ReactNode; }
export default function UserManagement(props: Props) {
  const { session } = useLearningSession(props.language);
  return <UserManagementBody key={session?.user.id ?? 'anonymous'} {...props} />;
}
function UserManagementBody({ language, renderActions }: Props) {
  const client = learningClient(language);
  const { session, isLoading: checkingSession } = useLearningSession(language);
  const access = useAdminAccess(client, language, session, checkingSession);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(0);
  const mutationLock = useRef(false);
  const [selected, setSelected] = useState<ManagedUser | null>(null);
  useEffect(() => { const timer = setTimeout(() => { setQuery(search.trim()); setPage(0); }, 250); return () => clearTimeout(timer); }, [search]);
  const users = useQuery({
    queryKey: [language, 'admin-users', session?.user.id, query, role, page],
    enabled: access.data === true && Boolean(session),
    queryFn: async ({ signal }) => {
      let request = client.from('profiles').select('id, first_name, last_name, role', { count: 'exact' }).order('id').range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1).abortSignal(signal);
      if (query) request = isFullUserId(query) ? request.eq('id', query) : request.or(userNameFilter(query));
      if (role !== 'all') request = request.eq('role', role);
      const { data, error, count } = await request;
      if (error) throw error;
      const profiles: ManagedUser[] = (data ?? []).map(user => ({ ...user, role: user.role === 'admin' ? 'admin' : 'user' }));
      if (!profiles.length) return { profiles, count: count ?? 0, emailsUnavailable: false };
      const { data: emails, error: emailError } = await client.from('auth_users').select('id, email').in('id', profiles.map(user => user.id)).abortSignal(signal);
      const byId = new Map((emails ?? []).map(user => [user.id, user.email]));
      return { profiles: profiles.map(user => ({ ...user, email: byId.get(user.id) })), count: count ?? profiles.length, emailsUnavailable: Boolean(emailError) };
    },
    retry: false,
  });
  const pages = Math.max(1, Math.ceil((users.data?.count ?? 0) / PAGE_SIZE));
  useEffect(() => { if (users.data && page >= pages) setPage(pages - 1); }, [users.data, page, pages]);
  const changeRole = useMutation({
    mutationFn: async (user: ManagedUser) => {
      if (!session || !access.data || user.id === session.user.id) throw new Error('Không thể thay đổi quyền của chính mình.');
      const { data: auth, error: authError } = await client.auth.getUser();
      if (authError || auth.user?.id !== session.user.id) throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng tải lại trang.');
      const { data: actor, error: roleError } = await client.from('profiles').select('role').eq('id', session.user.id).single();
      if (roleError || actor?.role !== 'admin') throw new Error('Bạn không còn quyền quản trị.');
      const { data, error } = await client.from('profiles').update({ role: user.role === 'admin' ? 'user' : 'admin' }).eq('id', user.id).eq('role', user.role).select('id, role').maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Quyền đã thay đổi hoặc thao tác không được phép. Hãy tải lại danh sách.');
    },
    onSuccess: () => { setSelected(null); toast.success('Đã cập nhật quyền người dùng.'); },
    onError: (error: Error) => toast.error(error.message),
    onSettled: async () => { try { await queryClient.invalidateQueries({ queryKey: [language, 'admin-users'] }); await queryClient.invalidateQueries({ queryKey: [language, 'admin-access'] }); } finally { mutationLock.current = false; } },
  });
  if (checkingSession || access.isLoading) return <p role="status" className="p-6">Đang kiểm tra quyền quản trị…</p>;
  if (!session || !access.data) return <div role="alert" className="rounded-xl border p-6"><p>{access.error ? 'Không thể kiểm tra quyền truy cập.' : 'Chỉ quản trị viên có thể xem danh sách người dùng.'}</p>{access.error && <Button onClick={() => access.refetch()} variant="outline" className="mt-3">Thử lại</Button>}</div>;
  return <section className="space-y-5 rounded-2xl border bg-card p-4 sm:p-6" aria-label="Quản lý người dùng">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-xl font-bold"><Users className="h-5 w-5" />Quản lý người dùng</h2><p className="mt-1 text-sm text-muted-foreground">{users.data?.count ?? 0} tài khoản phù hợp · Phân quyền có xác nhận</p></div><Button variant="outline" disabled={users.isFetching} onClick={() => users.refetch()}><RefreshCw className={`mr-2 h-4 w-4 ${users.isFetching ? 'animate-spin' : ''}`} />Tải lại</Button></div>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Tìm người dùng" placeholder="Tìm theo tên hoặc ID đầy đủ…" className="pl-9" maxLength={120} value={search} onChange={e => setSearch(e.target.value)} /></div><Select value={role} onValueChange={value => { setRole(value); setPage(0); }}><SelectTrigger className="sm:w-48" aria-label="Lọc vai trò"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả vai trò</SelectItem><SelectItem value="admin">Quản trị viên</SelectItem><SelectItem value="user">Học viên</SelectItem></SelectContent></Select></div>
    {users.data?.emailsUnavailable && <p className="text-sm text-muted-foreground">Chưa đọc được email tài khoản. Bạn vẫn có thể quản lý bằng tên và ID.</p>}
    {users.isLoading ? <div role="status" className="flex items-center gap-2 py-10"><Loader2 className="h-5 w-5 animate-spin" />Đang tải người dùng…</div> : users.error ? <div role="alert" className="space-y-3 py-6"><p>Không tải được danh sách người dùng.</p><Button variant="outline" onClick={() => users.refetch()}>Thử lại</Button></div> : <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Người dùng</TableHead><TableHead>Email / ID</TableHead><TableHead>Vai trò</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>
      {users.data?.profiles.map(user => <TableRow key={user.id}><TableCell className="font-medium">{userDisplayName(user)}{user.id === session.user.id && <span className="ml-2 text-xs text-muted-foreground">(Bạn)</span>}</TableCell><TableCell><p className="text-sm">{user.email || 'Chưa có email'}</p><p className="font-mono text-xs text-muted-foreground" title={user.id}>{user.id}</p></TableCell><TableCell><span className={`rounded-full px-2 py-1 text-xs ${user.role === 'admin' ? 'bg-violet-500/10 text-violet-700 dark:text-violet-300' : 'bg-secondary'}`}>{user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}</span></TableCell><TableCell><div className="flex justify-end gap-2">{renderActions?.(user)}<Button variant="outline" size="sm" disabled={user.id === session.user.id || changeRole.isPending} onClick={() => setSelected(user)}><ShieldCheck className="mr-2 h-4 w-4" />Đổi quyền</Button></div></TableCell></TableRow>)}
      {!users.data?.profiles.length && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">Không tìm thấy người dùng phù hợp.</TableCell></TableRow>}
    </TableBody></Table></div>}
    <div className="flex items-center justify-between gap-3 border-t pt-4"><p className="text-sm text-muted-foreground">Trang {page + 1} / {pages}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 0 || users.isFetching} onClick={() => setPage(value => value - 1)}>Trước</Button><Button variant="outline" size="sm" disabled={page + 1 >= pages || users.isFetching} onClick={() => setPage(value => value + 1)}>Sau</Button></div></div>
    <AlertDialog open={Boolean(selected)} onOpenChange={open => { if (!open && !changeRole.isPending) setSelected(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận đổi quyền</AlertDialogTitle><AlertDialogDescription>{selected && `Đổi ${userDisplayName(selected)} thành ${selected.role === 'admin' ? 'học viên' : 'quản trị viên'}? Quản trị viên có quyền quản lý nội dung và tài khoản.`}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={changeRole.isPending}>Hủy</AlertDialogCancel><Button disabled={!selected || changeRole.isPending} onClick={() => { if (selected && !mutationLock.current) { mutationLock.current = true; changeRole.mutate(selected); } }}>{changeRole.isPending ? 'Đang lưu…' : 'Xác nhận đổi quyền'}</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </section>;
}
