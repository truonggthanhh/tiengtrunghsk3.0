"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // Cần một trang update-password
    });

    if (error) {
      toast.error(`Lỗi: ${error.message}`);
    } else {
      setMessage('Vui lòng kiểm tra email của bạn để nhận liên kết đặt lại mật khẩu.');
      toast.success('Đã gửi liên kết đặt lại mật khẩu!');
      setEmail('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md p-6 mt-16 rounded-2xl bg-white dark:bg-black/20 border border-ink/10">
        <Link to="/cantonese/login" className="text-sm text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream mb-4 inline-block">← Quay về Đăng nhập</Link>
        <h1 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h1>
        <p className="text-center text-ink/70 dark:text-cream/70 mb-6">
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-ink dark:text-cream">Địa chỉ email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Gửi liên kết đặt lại
          </Button>
        </form>
        {message && <p className="mt-4 text-center text-jade">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;