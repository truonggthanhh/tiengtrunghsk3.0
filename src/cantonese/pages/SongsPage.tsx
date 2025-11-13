import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Home, Music, Sparkles, Play } from 'lucide-react';

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
    <main className="relative min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Film grain effect - ONLY in dark mode */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
      }} />

      {/* Scanlines - ONLY in dark mode */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-50 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        backgroundSize: '100% 2px'
      }} />

      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-white to-purple-50 dark:bg-[radial-gradient(ellipse_at_top,_rgba(0,240,255,0.15)_0%,_rgba(0,0,0,1)_50%)]" />

      {/* Musical notes pattern - ONLY in dark mode */}
      <div className="hidden dark:block fixed inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300F0FF\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M20 30 L20 10 L24 8 L24 28 M16 32 A4 4 0 1 1 16 32 M28 30 A4 4 0 1 1 28 30\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '80px 80px'
      }} />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        {/* Back button */}
        <Link
          to="/cantonese"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-cyan-300 dark:border-cyan-600 bg-white/90 dark:bg-black/70 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-all shadow-md hover:shadow-lg text-sm font-medium mb-8"
        >
          <Home className="h-4 w-4" />
          Quay về trang chủ
        </Link>

        {/* Header with Cantopop style */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-cyan-600 dark:text-cyan-400 transition-colors">
              <span className="inline-block" style={{
                textShadow: '0 0 5px rgba(0,240,255,0.3), 0 0 10px rgba(0,240,255,0.2)',
                filter: 'brightness(1.1)'
              }}>
                🎤 Cantopop 🎵
              </span>
            </h1>

            {/* Glow effect - ONLY in dark mode */}
            <div className="hidden dark:block absolute inset-0 blur-3xl opacity-40 -z-10" style={{
              background: 'radial-gradient(ellipse, rgba(0,240,255,0.4) 0%, transparent 70%)'
            }} />
          </div>

          <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            <span style={{ textShadow: '0 0 8px rgba(147,51,234,0.3)' }}>
              HỌC QUA BÀI HÁT
            </span>
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base flex items-center justify-center gap-2">
            {songs?.length || 0} bài hát Cantopop
            <Music className="h-4 w-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
          </p>
        </div>

        {/* Songs grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {songs?.map((song: any) => (
            <Link
              key={song.id}
              to={`/cantonese/songs/${song.id}`}
              className="group relative p-6 rounded-2xl transition-all duration-300 overflow-hidden bg-white/95 dark:bg-black/70 backdrop-blur-md border-2 border-cyan-300 dark:border-cyan-600 hover:border-purple-400 dark:hover:border-purple-400 shadow-xl dark:shadow-cyan-500/20 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Neon border gradient - ONLY in dark mode */}
              <div
                className="hidden dark:block absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity"
                style={{
                  background: 'linear-gradient(45deg, #00F0FF, #8B5CF6, #FF10F0, #00F0FF)',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              {/* Glow effect on hover - ONLY in dark mode */}
              <div className="hidden dark:block absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-4">
                {/* Play icon */}
                <div className="relative flex-shrink-0">
                  <div className="p-4 rounded-full bg-gradient-to-br from-cyan-200 to-purple-200 dark:from-cyan-900/50 dark:to-purple-900/50 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-cyan-500/30">
                    <Play className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="currentColor" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 dark:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xl text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    <span style={{ textShadow: '0 0 8px rgba(0,240,255,0.2)' }}>
                      {song.title}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {song.artist}
                  </div>
                </div>

                {/* Music note icon */}
                <Music className="flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SongsPage;