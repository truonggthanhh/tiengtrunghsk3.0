import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Home, ArrowLeft, Music } from 'lucide-react';

interface LrcLine {
  time: number;
  text: string;
}

// Declare YouTube Player API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const parseLrc = (lrcContent: string): LrcLine[] => {
  const lines = lrcContent.split('\n');
  const parsedLines: LrcLine[] = [];

  lines.forEach(line => {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);
      const time = (minutes * 60 + seconds) * 1000 + milliseconds;
      const text = match[4].trim();
      if (text) { // Only add non-empty lines
        parsedLines.push({ time, text });
      }
    }
  });
  return parsedLines.sort((a, b) => a.time - b.time);
};

const SongDetail = () => {
  const { songId } = useParams<{ songId: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [player, setPlayer] = useState<any>(null);
  const lyricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const { data: song, isLoading, error } = useQuery({
    queryKey: ['song', songId],
    queryFn: async () => {
      const { data, error } = await supabase.from('songs').select('*').eq('id', songId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!songId,
  });

  const lrcLines = React.useMemo(() => {
    return song?.lrc ? parseLrc(song.lrc) : [];
  }, [song?.lrc]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize YouTube Player
  useEffect(() => {
    if (!song?.youtube_video_id || !playerRef.current) return;

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        const newPlayer = new window.YT.Player(playerRef.current, {
          videoId: song.youtube_video_id,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready');
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                startTimeUpdate();
              }
            },
          },
        });
        setPlayer(newPlayer);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [song?.youtube_video_id]);

  const startTimeUpdate = () => {
    const interval = setInterval(() => {
      if (player && typeof player.getCurrentTime === 'function') {
        try {
          const time = player.getCurrentTime();
          setCurrentTime(time * 1000); // Convert to milliseconds
        } catch (e) {
          console.error('Error getting current time:', e);
        }
      }
    }, 100); // Update every 100ms for smooth sync

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (player) {
      const cleanup = startTimeUpdate();
      return cleanup;
    }
  }, [player]);

  // Update active line and scroll
  useEffect(() => {
    if (lrcLines.length > 0) {
      const newActiveLineIndex = lrcLines.findIndex((line, index) => {
        const nextLineTime = lrcLines[index + 1]?.time || Infinity;
        return currentTime >= line.time && currentTime < nextLineTime;
      });

      if (newActiveLineIndex !== activeLineIndex) {
        setActiveLineIndex(newActiveLineIndex);

        // Smooth scroll to active line
        if (newActiveLineIndex !== -1 && lyricRefs.current[newActiveLineIndex] && lyricsContainerRef.current) {
          const container = lyricsContainerRef.current;
          const activeElement = lyricRefs.current[newActiveLineIndex];

          if (activeElement) {
            const containerHeight = container.clientHeight;
            const elementTop = activeElement.offsetTop;
            const elementHeight = activeElement.clientHeight;
            const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);

            container.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            });
          }
        }
      }
    }
  }, [currentTime, lrcLines, activeLineIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-cyan-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mb-4"></div>
          <p className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">Đang tải bài hát...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-cyan-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium text-cyan-600 dark:text-cyan-400">Lỗi tải bài hát: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-cyan-950/20 dark:to-purple-950/20 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Không tìm thấy bài hát.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-cyan-950/20 dark:to-purple-950/20 transition-colors">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <Link
            to="/cantonese"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Home className="h-4 w-4" /> Trang chủ
          </Link>
          <Link
            to="/cantonese/songs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-pink-300 dark:border-pink-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/50 transition-all text-sm font-medium shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" /> Quay về danh sách
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <Music className="h-10 w-10 text-cyan-600 dark:text-cyan-400" />
            {song.title}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">{song.artist}</p>
        </div>

        {/* Video & Lyrics Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* YouTube Player */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl sticky top-6">
              <div className="aspect-video">
                <div ref={playerRef} className="w-full h-full"></div>
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{song.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{song.artist}</p>
              </div>
            </div>
          </div>

          {/* Lyrics Panel - Spotify/Apple Music Style */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
                <h2 className="font-black text-2xl text-gray-900 dark:text-white">Lời bài hát</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Theo dõi lời bài hát theo thời gian thực</p>
              </div>
              <div
                ref={lyricsContainerRef}
                className="h-[500px] overflow-y-auto px-8 py-12 scroll-smooth"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgb(6 182 212) transparent'
                }}
              >
                {lrcLines.length > 0 ? (
                  <div className="space-y-1">
                    {lrcLines.map((line, index) => {
                      const isActive = index === activeLineIndex;
                      const isPast = index < activeLineIndex;
                      const isFuture = index > activeLineIndex;

                      return (
                        <div
                          key={index}
                          ref={el => lyricRefs.current[index] = el}
                          className={`
                            py-3 px-4 rounded-xl transition-all duration-300 ease-out cursor-pointer
                            ${isActive
                              ? 'text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text transform scale-105 my-4'
                              : isPast
                                ? 'text-lg text-gray-400 dark:text-gray-600'
                                : 'text-lg text-gray-500 dark:text-gray-500'
                            }
                          `}
                          onClick={() => {
                            if (player && typeof player.seekTo === 'function') {
                              player.seekTo(line.time / 1000, true);
                              player.playVideo();
                            }
                          }}
                        >
                          {line.text}
                        </div>
                      );
                    })}
                    {/* Add padding at the end for better scrolling */}
                    <div className="h-64"></div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
                    <Music className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Không có lời bài hát (LRC) cho bài này.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Custom scrollbar for lyrics */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgb(6 182 212);
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgb(8 145 178);
        }
      `}</style>
    </main>
  );
};

export default SongDetail;
