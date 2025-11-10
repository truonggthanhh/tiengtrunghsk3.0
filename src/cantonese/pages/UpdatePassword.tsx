"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // Kiểm tra session để đảm bảo người dùng đã được xác thực qua email link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Phiên không hợp lệ hoặc đã hết hạn. Vui lòng thử lại quy trình đặt lại mật khẩu.');
        navigate('/cantonese/login');
      }
      setSessionChecked(true);
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(`Lỗi cập nhật mật khẩu: ${error.message}`);
    } else {
      toast.success('Mật khẩu của bạn đã được cập nhật thành công!');
      navigate('/cantonese/login');
    }
    setLoading(false);
  };

  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra phiên...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md p-6 mt-16 rounded-2xl bg-white dark:bg-black/20 border border-ink/10">
        <Link to="/cantonese/login" className="text-sm text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream mb-4 inline-block">← Quay về Đăng nhập</Link>
        <h1 className="text-2xl font-bold mb-4 text-center">Cập nhật mật khẩu</h1>
        <p className="text-center text-ink/70 dark:text-cream/70 mb-6">
          Vui lòng nhập mật khẩu mới của bạn.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-ink dark:text-cream">Mật khẩu mới</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 bg-cream dark:bg-black/10 border-ink/15"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-ink dark:text-cream">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 bg-cream dark:bg-black/10 border-ink/15"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-verm px-5 py-3 font-semibold text-ink shadow-[0_8px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cập nhật mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;