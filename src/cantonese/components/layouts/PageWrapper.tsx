import React from 'react';
import { BackgroundTexture } from '@/cantonese/components/ui/BackgroundTexture';
import { Link } from 'react-router-dom';
import UserMenu from '@/cantonese/components/UserMenu';
import DarkModeToggle from '@/cantonese/components/ui/DarkModeToggle';
import JyutpingToggle from '@/cantonese/components/ui/JyutpingToggle';
import { useProfile } from '@/cantonese/components/providers/ProfileProvider';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { UserCog, BarChart2, ChevronDown, BookOpen, Music, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PageWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageWrapper = ({ children, showBackButton = true }: PageWrapperProps) => {
  const { session } = useSession();
  const { isAdmin } = useProfile();
  return (
    <div className="relative min-h-screen">
      <BackgroundTexture variant="subtle" />

      {/* Navigation Bar */}
      <nav className="relative z-20 border-b border-ink/10 dark:border-white/10 bg-cream/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/cantonese" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl border-2 border-jade dark:border-jade/80 bg-jade dark:bg-jade/20 grid place-items-center shadow-lg">
                <span className="text-cream dark:text-jade font-black tracking-wider">粵</span>
              </div>
              <div>
                <div className="text-ink dark:text-cream font-extrabold leading-none tracking-wide">Học tiếng Quảng Đông</div>
                <div className="text-xs text-ink/80 dark:text-cream/80">cùng Hào Hoa Chợ Lớn</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-ink dark:text-cream font-medium">
              {/* Courses Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 hover:text-jade dark:hover:text-jade transition px-2">
                    <BookOpen className="h-4 w-4" />
                    Khóa học
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <DropdownMenuItem asChild>
                    <Link to="/cantonese/lessons" className="flex items-center gap-2 cursor-pointer">
                      <BookOpen className="h-4 w-4" />
                      Tất cả bài học
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Songs Link */}
              <Link to="/cantonese/songs" className="flex items-center gap-2 hover:opacity-80 hover:text-jade dark:hover:text-jade transition">
                <Music className="h-4 w-4" />
                Bài hát
              </Link>

              {/* Blog Link */}
              <Link to="/cantonese/blog" className="flex items-center gap-2 hover:opacity-80 hover:text-jade dark:hover:text-jade transition">
                <FileText className="h-4 w-4" />
                Blog
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {session && (
                <>
                  <Button asChild variant="ghost" size="sm" className="text-ink dark:text-cream hover:text-jade dark:hover:text-jade">
                    <Link to="/cantonese/learning-progress" className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Tiến độ</span>
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="ghost" size="sm" className="text-ink dark:text-cream hover:text-jade dark:hover:text-jade">
                      <Link to="/cantonese/dashboard" className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" />
                        <span className="hidden sm:inline">Quản trị</span>
                      </Link>
                    </Button>
                  )}
                </>
              )}
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