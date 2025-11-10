"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { useProfile } from '@/cantonese/components/providers/ProfileProvider';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Save } from 'lucide-react';

const ProfilePage = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const { profile, isLoadingProfile } = useProfile();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, first_name, last_name, avatar_url }: { id: string; first_name: string; last_name: string; avatar_url: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ first_name, last_name, avatar_url, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Hồ sơ đã được cập nhật thành công!');
    },
    onError: (err) => {
      toast.error(`Lỗi khi cập nhật hồ sơ: ${err.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.id) {
      updateProfileMutation.mutate({
        id: session.user.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
      });
    }
  };

  if (isSessionLoading || isLoadingProfile) {
    return <div className="max-w-2xl mx-auto p-6">Đang tải hồ sơ...</div>;
  }

  if (!session) {
    return <div className="max-w-2xl mx-auto p-6 text-verm">Vui lòng đăng nhập để xem hồ sơ.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex gap-3 mb-4">
        <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <Home className="h-4 w-4" /> Trang chủ
        </Link>
        <Link to="/lessons" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <ArrowLeft className="h-4 w-4" /> Quay về bài học
        </Link>
      </div>
      <Card className="bg-white dark:bg-black/20 border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-ink dark:text-cream">Email</Label>
              <Input id="email" type="email" value={session.user.email} disabled className="mt-1 bg-cream dark:bg-black/10 border-ink/15" />
            </div>
            <div>
              <Label htmlFor="firstName" className="text-ink dark:text-cream">Tên</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 bg-cream dark:bg-black/10 border-ink/15" />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-ink dark:text-cream">Họ</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 bg-cream dark:bg-black/10 border-ink/15" />
            </div>
            <div>
              <Label htmlFor="avatarUrl" className="text-ink dark:text-cream">URL ảnh đại diện</Label>
              <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 bg-cream dark:bg-black/10 border-ink/15" />
            </div>
            <Button type="submit" disabled={updateProfileMutation.isPending} className="inline-flex items-center gap-2 rounded-2xl bg-verm px-5 py-3 font-semibold text-ink shadow-[0_8px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform">
              <Save className="h-4 w-4" /> {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;