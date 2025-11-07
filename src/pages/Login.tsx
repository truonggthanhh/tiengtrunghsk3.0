import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Login: React.FC = () => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/');
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          {/* Decorative gradient blob */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-colorful rounded-full blur-3xl opacity-30 animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-sunset rounded-full blur-3xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
          </div>

          <Card className="relative z-10 border-0 shadow-2xl bg-white/80 backdrop-blur-lg">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-vivid rounded-2xl flex items-center justify-center shadow-pink animate-pulse-glow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-vivid bg-clip-text text-transparent">
                Đăng nhập hoặc Đăng ký
              </CardTitle>
              <CardDescription className="text-base">
                Chào mừng bạn đến với <span className="font-bold text-purple-600">TIẾNG TRUNG HAOHAO</span>!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                providers={['google']}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#f093fb',
                        brandAccent: '#f5576c',
                      },
                    },
                  },
                  className: {
                    button: 'hover-scale',
                  },
                }}
                theme="light"
                redirectTo={window.location.origin + '/'}
              />
            </CardContent>
          </Card>

          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center relative z-10">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md hover-scale">
              <div className="text-2xl font-bold bg-gradient-colorful bg-clip-text text-transparent">6</div>
              <div className="text-xs text-gray-600 font-medium">Cấp độ HSK</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md hover-scale">
              <div className="text-2xl font-bold bg-gradient-sunset bg-clip-text text-transparent">5000+</div>
              <div className="text-xs text-gray-600 font-medium">Từ vựng</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md hover-scale">
              <div className="text-2xl font-bold bg-gradient-spring bg-clip-text text-transparent">9</div>
              <div className="text-xs text-gray-600 font-medium">Dạng bài tập</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;