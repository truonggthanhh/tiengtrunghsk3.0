import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Home, Loader2, UserCog } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  email: string; // Assuming email can be fetched or is part of the profile
}

const AdminDashboardPage: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSessionLoading) {
      if (!session) {
        navigate('/login');
        return;
      }
      fetchUserProfile(session.user.id);
    }
  }, [session, isSessionLoading, navigate]);

  const fetchUserProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (profileError || !profileData?.is_admin) {
      setError('Bạn không có quyền truy cập trang này.');
      setIsLoadingUsers(false);
      toast.error('Truy cập bị từ chối', { description: 'Bạn không có quyền quản trị.' });
      navigate('/'); // Redirect non-admin users
      return;
    }
    fetchUsers();
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setError(null);
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, is_admin, auth_users(email)'); // Fetch email from auth.users

    if (usersError) {
      setError('Không thể tải danh sách người dùng: ' + usersError.message);
      toast.error('Lỗi tải người dùng', { description: usersError.message });
    } else {
      const formattedUsers: UserProfile[] = usersData.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        is_admin: profile.is_admin,
        email: (profile.auth_users as any)?.email || 'N/A', // Access email from nested object
      }));
      setUsers(formattedUsers);
    }
    setIsLoadingUsers(false);
  };

  const handleAdminToggle = async (userId: string, currentStatus: boolean) => {
    if (session?.user.id === userId) {
      toast.error('Không thể thay đổi quyền của chính mình', { description: 'Bạn không thể tự gỡ bỏ quyền quản trị của mình.' });
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (updateError) {
      toast.error('Cập nhật thất bại', { description: updateError.message });
    } else {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, is_admin: !currentStatus } : user
        )
      );
      toast.success('Cập nhật thành công', { description: `Quyền quản trị của người dùng đã được thay đổi thành ${!currentStatus ? 'admin' : 'người dùng thường'}.` });
    }
  };

  if (isSessionLoading || isLoadingUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <UserCog className="w-12 h-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl">Lỗi Truy Cập</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="font-bold">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" /> Quay lại trang chủ
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <UserCog className="h-7 w-7" /> Bảng Điều Khiển Quản Trị
            </CardTitle>
            <CardDescription>Quản lý người dùng và quyền truy cập.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-center">Quản trị viên</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.id.substring(0, 8)}...</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Switch
                          id={`admin-toggle-${user.id}`}
                          checked={user.is_admin}
                          onCheckedChange={() => handleAdminToggle(user.id, user.is_admin)}
                          disabled={session?.user.id === user.id} // Prevent user from changing their own admin status
                        />
                        <Label htmlFor={`admin-toggle-${user.id}`} className="sr-only">Toggle admin status for {user.first_name}</Label>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="text-center mt-8">
          <Button asChild variant="secondary" className="font-bold">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Quay lại trang chủ
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;