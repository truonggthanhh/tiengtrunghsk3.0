"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { useProfile } from '@/cantonese/components/providers/ProfileProvider';
import { supabase } from '@/cantonese/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, BookOpen, LayoutDashboard, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function UserMenu() {
  const { session, isLoading: isSessionLoading } = useSession();
  const { profile, isLoadingProfile, isAdmin } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Lỗi khi đăng xuất: ${error.message}`);
    } else {
      toast.success('Đã đăng xuất thành công!');
      navigate('/cantonese');
    }
  };

  if (isSessionLoading || isLoadingProfile) {
    return <div className="h-9 w-24 animate-pulse rounded-xl bg-ink/10 dark:bg-white/10" />;
  }

  if (!session || !profile) {
    return (
      <Link to="/cantonese/login" className="rounded-xl px-4 py-2 text-ink bg-white dark:bg-black/20 hover:bg-white/90 transition shadow-md">
        Đăng nhập
      </Link>
    );
  }

  const displayName = profile.first_name || profile.last_name || 'Người dùng';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-xl px-4 py-2 text-ink bg-white dark:bg-black/20 hover:bg-white/90 transition shadow-md">
          <User className="h-4 w-4 mr-2" /> {displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-black/20 border border-ink/10 shadow-lg">
        <DropdownMenuLabel className="font-bold text-ink dark:text-cream">Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-ink/10 dark:bg-white/10" />
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
          <Link to="/cantonese/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Hồ sơ của tôi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
          <Link to="/cantonese/learning-progress" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> Quá trình học tập
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
            <Link to="/cantonese/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-ink/10 dark:bg-white/10" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-verm hover:bg-verm/10 dark:hover:bg-verm/20">
          <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}