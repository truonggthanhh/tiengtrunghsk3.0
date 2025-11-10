import React from 'react';
import { BackgroundTexture } from '@/cantonese/components/ui/BackgroundTexture';
import { Link } from 'react-router-dom';
import UserMenu from '@/cantonese/components/UserMenu';
import DarkModeToggle from '@/cantonese/components/ui/DarkModeToggle';
import JyutpingToggle from '@/cantonese/components/ui/JyutpingToggle';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen">
      <BackgroundTexture variant="subtle" />

      {/* Navigation Bar */}
      <nav className="relative z-20 border-b border-ink/10 bg-cream/80 dark:bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl border border-ink/20 bg-jade grid place-items-center shadow-[0_0_0_2px_rgba(0,0,0,0.2)]">
                <span className="text-cream font-black tracking-wider">粵</span>
              </div>
              <div>
                <div className="text-ink dark:text-cream font-extrabold leading-none tracking-wide">Học tiếng Quảng Đông</div>
                <div className="text-xs text-ink/80 dark:text-cream/80">cùng Hào Hoa Chợ Lớn</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-ink dark:text-cream">
              <Link to="/lessons" className="hover:opacity-80 transition">Bài học</Link>
              <Link to="/songs" className="hover:opacity-80 transition">Bài hát</Link>
            </div>

            <div className="flex items-center gap-2">
              <JyutpingToggle />
              <DarkModeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;