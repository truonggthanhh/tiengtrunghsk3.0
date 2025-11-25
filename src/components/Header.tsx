import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, UserCog, Languages, User, BarChart2, BookOpen, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { usePinyin } from "@/contexts/PinyinContext";

const Header = () => {
  const { session, isLoading } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const { showPinyin, togglePinyin } = usePinyin();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Failed to check admin status:', error);
          setIsAdmin(false);
          return;
        }

        if (profile && profile.is_admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }
  }, [session, isLoading]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Đăng xuất thất bại", { description: error.message });
    } else {
      toast.success("Đăng xuất thành công", { description: "Bạn đã đăng xuất khỏi tài khoản." });
    }
  };

  return (
    <header className="py-4 px-6 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/mandarin"
          className="text-2xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
        >
          TIẾNG TRUNG HAOHAO
        </Link>
        <div className="flex items-center gap-3">
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
              <Link to="/mandarin/login">Đăng nhập</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;