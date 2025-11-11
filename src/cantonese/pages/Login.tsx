"use client";

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import EmailPasswordAuthForm from '@/cantonese/components/auth/EmailPasswordForm'; // Import form tùy chỉnh

// Đối tượng localization đầy đủ cho tiếng Việt
const vietnameseLocalization = {
  variables: {
    sign_in: {
      email_label: 'Địa chỉ email',
      password_label: 'Mật khẩu',
      email_input_placeholder: 'Nhập địa chỉ email của bạn',
      password_input_placeholder: 'Nhập mật khẩu của bạn',
      button_label: 'Đăng nhập',
      social_provider_text: 'Hoặc đăng nhập bằng',
      link_text: 'Bạn đã có tài khoản? Đăng nhập',
      forgotten_password_link_text: 'Bạn quên mật khẩu? Nhấp vào đây',
      no_account_yet: 'Chưa có tài khoản?',
      sign_up_link_text: 'Đăng ký',
    },
    sign_up: {
      email_label: 'Địa chỉ email',
      password_label: 'Mật khẩu',
      email_input_placeholder: 'Nhập địa chỉ email của bạn',
      password_input_placeholder: 'Tạo mật khẩu',
      button_label: 'Đăng ký',
      social_provider_text: 'Hoặc đăng ký bằng',
      link_text: 'Bạn đã có tài khoản? Đăng nhập',
      sign_in_link_text: 'Đăng nhập',
    },
    forgotten_password: {
      email_label: 'Địa chỉ email',
      password_input_placeholder: 'Nhập địa chỉ email của bạn',
      button_label: 'Gửi hướng dẫn đặt lại mật khẩu',
      link_text: 'Chưa có tài khoản? Đăng ký',
    },
    update_password: {
      password_label: 'Mật khẩu mới',
      password_input_placeholder: 'Nhập mật khẩu mới của bạn',
      button_label: 'Cập nhật mật khẩu',
    },
    magic_link: {
      email_input_placeholder: 'Nhập địa chỉ email của bạn',
      button_label: 'Gửi liên kết đăng nhập',
      link_text: 'Bạn đã có tài khoản? Đăng nhập',
    },
    common: {
      not_a_valid_email: 'Email không hợp lệ',
      password_length_at_least: 'Mật khẩu phải có ít nhất {{length}} ký tự',
      password_no_uppercase: 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa',
      password_no_lowercase: 'Mật khẩu phải chứa ít nhất một chữ cái viết thường',
      password_no_numbers: 'Mật khẩu phải chứa ít nhất một số',
      password_no_symbols: 'Mật khẩu phải chứa ít nhất một ký hiệu',
      sign_in_with_email: 'Đăng nhập bằng email',
      sign_up_with_email: 'Đăng ký bằng email',
      loading_button_label: 'Đang tải...',
      email_not_found: 'Không tìm thấy email',
      email_already_registered: 'Email đã được đăng ký',
      invalid_email_password: 'Email hoặc mật khẩu không hợp lệ',
      bad_email_password: 'Email hoặc mật khẩu không hợp lệ',
      enter_email_for_magic_link: 'Nhập email của bạn để nhận liên kết đăng nhập',
      enter_email_for_password_reset: 'Nhập email của bạn để đặt lại mật khẩu',
      email_sent: 'Email đã được gửi',
      confirmation_text: 'Kiểm tra email của bạn để xác nhận',
      password_reset_sent: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn',
      password_updated: 'Mật khẩu của bạn đã được cập nhật',
      sign_out: 'Đăng xuất',
      sign_in_with_google: 'Đăng nhập bằng Google',
      sign_in_with_apple: 'Đăng nhập bằng Apple',
      sign_in_with_microsoft: 'Đăng nhập bằng Microsoft',
      sign_up_with_google: 'Đăng ký bằng Google',
      sign_up_with_apple: 'Đăng ký bằng Apple',
      sign_up_with_microsoft: 'Đăng ký bằng Microsoft',
    },
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/cantonese/lessons');
    }
  }, [session, isLoading, navigate]);

  if (isLoading || session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-2xl p-6 mt-16 rounded-2xl bg-white dark:bg-black/20 border border-ink/10">
        <Link to="/cantonese" className="text-sm text-ink/70 hover:text-ink dark:text-cream/70 dark:hover:text-cream mb-4 inline-block">← Quay về trang chủ</Link>
        <h1 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h1>

        {/* Form đăng nhập/đăng ký bằng Email/Mật khẩu tùy chỉnh */}
        <EmailPasswordAuthForm />

        {/* Các tùy chọn đăng nhập bằng mạng xã hội */}
        <div className="mt-6">
          <p className="text-center text-ink/70 dark:text-cream/70 mb-4">Hoặc đăng nhập bằng</p>
          <Auth
            supabaseClient={supabase}
            providers={['google']}
            onlyThirdPartyProviders={true}
            appearance={{
              theme: ThemeSupa,
            }}
            theme="light"
            redirectTo={window.location.origin + '/cantonese/lessons'}
            localization={vietnameseLocalization}
            socialLayout="horizontal"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;