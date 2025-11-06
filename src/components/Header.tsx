import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, UserCog } from "lucide-react";
import { toast } from "sonner";

const Header = () => {
  const { session, isLoading } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
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
    <header className="p-4 border-b border-primary/10 sticky top-0 bg-background/95 backdrop-blur-md z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent hover:scale-105 transition-all duration-300 drop-shadow-sm"
        >
          TIẾNG TRUNG HAOHAO
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          {isAdmin && (
            <Button asChild variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
              <Link to="/admin" className="flex items-center">
                <UserCog className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Quản trị</span>
              </Link>
            </Button>
          )}
          {session ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;