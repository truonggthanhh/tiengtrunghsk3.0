import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Home, Music } from 'lucide-react';

const SongsPage = () => {
  const { data: songs, isLoading, error } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="max-w-5xl mx-auto p-6">Đang tải bài hát...</div>;
  }

  if (error) {
    return <div className="max-w-5xl mx-auto p-6 text-verm">Lỗi: {error.message}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link to="/cantonese" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm mb-4">
        <Home className="h-4 w-4" /> Quay về trang chủ
      </Link>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Music className="h-6 w-6 text-jade" /> Học qua bài hát
      </h1>
      <div className="grid md:grid-cols-2 gap-4">
        {songs?.map((song: any) => (
          <Link key={song.id} to={`/cantonese/songs/${song.id}`} className="block p-4 rounded-xl bg-white dark:bg-black/20 border border-ink/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-[0_10px_0_#d7c8b6]">
            <div className="font-semibold text-lg">{song.title}</div>
            <div className="text-sm text-ink/70">{song.artist}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SongsPage;