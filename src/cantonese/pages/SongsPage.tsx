import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Home, Music, Play } from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-cyan-600 dark:text-cyan-400">Đang tải bài hát...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Lỗi: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Back button */}
        <Link
          to="/cantonese"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-900 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/50 transition-colors text-sm font-medium mb-8"
        >
          <Home className="h-4 w-4" />
          Quay về trang chủ
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-cyan-600 dark:text-cyan-400">
            🎤 Cantopop 🎵
          </h1>

          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-3">
            HỌC QUA BÀI HÁT
          </p>

          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            {songs?.length || 0} bài hát Cantopop
            <Music className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
          </p>
        </div>

        {/* Songs grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {songs?.map((song: any) => (
            <Link
              key={song.id}
              to={`/cantonese/songs/${song.id}`}
              className="group p-5 rounded-lg border-2 border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-900 hover:border-purple-400 dark:hover:border-purple-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Play icon */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-900/50 dark:to-purple-900/50 group-hover:scale-105 transition-transform">
                  <Play className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="currentColor" />
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                    {song.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {song.artist}
                  </div>
                </div>

                {/* Music icon */}
                <Music className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SongsPage;