import { useAdminAccess } from '@/hooks/useAdminAccess';
import { useSignOut } from '@/hooks/useSignOut';
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { useSession } from '@/components/SessionContextProvider.shared';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookMarked, LogOut, UserCog, Languages, User, BarChart2, BookOpen, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { usePinyin } from '@/contexts/PinyinContext.shared';

const Header = () => {
  const { session, isLoading } = useSession();
  const access = useAdminAccess(supabase, 'mandarin', session, isLoading);
  const isAdmin = access.data === true;
  const { showPinyin, togglePinyin } = usePinyin();
  const { signOut: handleLogout, pending: signingOut } = useSignOut('mandarin');

  return (
    <header className="py-4 px-6 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/mandarin"
          className="text-lg md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
        >
          TIẾNG TRUNG HAOHAO
        </Link>
        <div className="flex max-w-full flex-wrap items-center gap-2">
          {/* Pinyin Toggle Button */}
          <Button
            variant={showPinyin ? "default" : "outline"}
            size="sm"
            onClick={togglePinyin}
            className={`flex items-center gap-2 ${showPinyin ? 'bg-gradient-spring text-white dark:text-white hover:bg-gradient-spring/90 border-0' : ''}`}
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{showPinyin ? 'Có Pinyin' : 'Không Pinyin'}</span>
          </Button>

          <Button asChild variant="ghost" size="sm"><Link to="/mandarin/notebook" aria-label="Sổ từ cá nhân" className="flex items-center gap-2"><BookMarked className="h-4 w-4" /><span className="hidden sm:inline">Sổ từ</span></Link></Button>
          {/* Dictionary - Available to everyone */}
          <Button asChild variant="ghost" size="sm">
            <Link to="/mandarin/dictionary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Từ điển</span>
            </Link>
          </Button>

          {/* Blog - Available to everyone */}
          <Button asChild variant="ghost" size="sm">
            <Link to="/mandarin/blog" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </Link>
          </Button>

          {session && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/mandarin/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Hồ sơ</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/mandarin/learning-progress" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Tiến độ</span>
                </Link>
              </Button>
            </>
          )}

          {isAdmin && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/mandarin/admin" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline">Quản trị</span>
              </Link>
            </Button>
          )}

          {session ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={signingOut}
              aria-label={signingOut ? 'Đang đăng xuất' : 'Đăng xuất'}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
            >
              <Link to={`/mandarin/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`}>Đăng nhập</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;