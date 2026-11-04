import { Link } from 'react-router-dom';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider.shared';
import { useProfile } from '@/cantonese/components/providers/ProfileProvider.shared';
import { supabase } from '@/cantonese/integrations/supabase/client';
import ProfileEditor from '@/components/auth/ProfileEditor';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { session, isLoading } = useSession();
  const { profile, isLoadingProfile } = useProfile();
  if (isLoading || isLoadingProfile) return <p role="status" className="p-6 text-center">Đang tải hồ sơ…</p>;
  if (!session) return <div className="mx-auto max-w-md space-y-4 p-6"><p>Đăng nhập để cập nhật hồ sơ.</p><Button asChild><Link to="/cantonese/login?returnUrl=%2Fcantonese%2Fprofile">Đăng nhập</Link></Button></div>;
  return <main className="mx-auto max-w-2xl space-y-5 px-4 py-8"><h1 className="text-2xl font-bold">Hồ sơ của tôi</h1><ProfileEditor key={session.user.id} client={supabase} language="cantonese" session={session} profile={profile ?? { first_name: null, last_name: null, avatar_url: null }} /><div className="flex flex-wrap gap-3"><Button variant="outline" asChild><Link to="/cantonese/notebook">Sổ từ cá nhân</Link></Button><Button variant="outline" asChild><Link to="/cantonese/forgot-password">Đặt lại mật khẩu</Link></Button></div></main>;
}
