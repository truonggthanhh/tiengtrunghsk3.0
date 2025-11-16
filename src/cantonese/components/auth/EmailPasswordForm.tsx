"use client";

import React, { useState } from 'react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const EmailPasswordAuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate password strength
        const passwordError = validatePassword(password);
        if (passwordError) {
          toast.error(passwordError);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/cantonese/lessons`,
            data: {
              email: email,
            }
          }
        });

        console.log('Sign up response:', { data, error });

        if (error) {
          console.error('Sign up error:', error);
          // Xử lý các loại lỗi phổ biến
          if (error.message.includes('User already registered')) {
            toast.error('Email này đã được đăng ký. Vui lòng đăng nhập.');
            setIsSignUp(false);
          } else if (error.message.includes('Password should be at least')) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
          } else if (error.message.includes('Unable to validate email')) {
            toast.error('Email không hợp lệ. Vui lòng kiểm tra lại.');
          } else {
            toast.error(`Lỗi đăng ký: ${error.message}`);
          }
        } else {
          // Kiểm tra xem email confirmation có được yêu cầu không
          if (data?.user?.identities && data.user.identities.length === 0) {
            toast.error('Email này đã được đăng ký. Vui lòng đăng nhập.');
            setIsSignUp(false);
          } else if (data?.user && !data.session) {
            // Email confirmation required
            toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
            setEmail('');
            setPassword('');
            setIsSignUp(false);
          } else if (data?.session) {
            // Auto-login enabled, email confirmation disabled
            toast.success('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
              navigate('/cantonese/lessons');
            }, 500);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Cung cấp error message thân thiện hơn
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Vui lòng xác nhận email của bạn trước khi đăng nhập. Kiểm tra hộp thư của bạn.');
          } else {
            toast.error(`Lỗi đăng nhập: ${error.message}`);
          }
        } else if (data?.session) {
          toast.success('Đăng nhập thành công!');
          // Navigate sẽ được xử lý bởi Login.tsx useEffect
        }
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <div>
        <Label htmlFor="password" className="text-ink dark:text-cream">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          placeholder={isSignUp ? 'Tạo mật khẩu (tối thiểu 6 ký tự)' : 'Nhập mật khẩu của bạn'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 bg-cream dark:bg-black/10 border-ink/15"
        />
        {isSignUp && (
          <p className="text-xs text-ink/60 dark:text-cream/60 mt-1">
            Mật khẩu phải có ít nhất 6 ký tự
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-verm px-5 py-3 font-semibold text-ink shadow-[0_8px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
      </Button>
      <div className="text-center text-sm mt-4">
        {isSignUp ? (
          <p className="text-ink/70 dark:text-cream/70">
            Bạn đã có tài khoản?{' '}
            <button type="button" onClick={() => setIsSignUp(false)} className="text-verm hover:underline">
              Đăng nhập
            </button>
          </p>
        ) : (
          <p className="text-ink/70 dark:text-cream/70">
            Chưa có tài khoản?{' '}
            <button type="button" onClick={() => setIsSignUp(true)} className="text-verm hover:underline">
              Đăng ký
            </button>
          </p>
        )}
        <p className="mt-2">
          <Link to="/cantonese/forgot-password" className="text-ink/70 dark:text-cream/70 hover:underline">
            Bạn quên mật khẩu?
          </Link>
        </p>
      </div>
    </form>
  );
};

export default EmailPasswordAuthForm;