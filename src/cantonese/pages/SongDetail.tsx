import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Home, ArrowLeft, Music } from 'lucide-react';

interface LrcLine {
  time: number;
  text: string;
}

const parseLrc = (lrcContent: string): LrcLine[] => {
  const lines = lrcContent.split('\n');
  const parsedLines: LrcLine[] = [];

  lines.forEach(line => {
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10); // Pad to 3 digits for consistency
      const time = (minutes * 60 + seconds) * 1000 + milliseconds;
      const text = match[4].trim();
      parsedLines.push({ time, text });
    }
  });
  return parsedLines.sort((a, b) => a.time - b.time);
};

const SongDetail = () => {
  const { songId } = useParams<{ songId: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const lyricRefs = useRef<(HTMLLIElement | null)[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;

      const data = JSON.parse(event.data);
      if (data.event === 'onStateChange' && data.info === 1) { // Playing
        // Start polling for current time
        const interval = setInterval(() => {
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: 'getCurrentTime',
            }), '*');
          }
        }, 200); // Poll every 200ms
        return () => clearInterval(interval);
      } else if (data.event === 'onStateChange' && data.info === 2) { // Paused
        setCurrentTime(0); // Reset current time when paused
      } else if (data.event === 'onCurrentTime') {
        setCurrentTime(data.info * 1000); // Convert seconds to milliseconds
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (lrcLines.length > 0) {
      const newActiveLineIndex = lrcLines.findIndex((line, index) => {
        const nextLineTime = lrcLines[index + 1]?.time || Infinity;
        return currentTime >= line.time && currentTime < nextLineTime;
      });
      setActiveLineIndex(newActiveLineIndex);

      // Scroll active lyric into view
      if (newActiveLineIndex !== -1 && lyricRefs.current[newActiveLineIndex]) {
        lyricRefs.current[newActiveLineIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentTime, lrcLines]);

  if (isLoading) {
    return <div className="max-w-5xl mx-auto p-6">Đang tải bài hát...</div>;
  }

  if (error) {
    return <div className="max-w-5xl mx-auto p-6 text-verm">Lỗi tải bài hát: {error.message}</div>;
  }

  if (!song) {
    return <div className="max-w-5xl mx-auto p-6">Không tìm thấy bài hát.</div>;
  }

  const youtubeEmbedUrl = song.youtube_video_id
    ? `https://www.youtube.com/embed/${song.youtube_video_id}?enablejsapi=1&autoplay=0`
    : '';

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <Link to="/cantonese" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium">
            <Home className="h-4 w-4" /> Trang chủ
          </Link>
          <Link to="/cantonese/songs" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-300 dark:border-pink-700 bg-white dark:bg-gray-900 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/50 transition-colors text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Quay về danh sách
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-cyan-600 dark:text-cyan-400 flex items-center gap-3">
            <Music className="h-8 w-8" /> {song.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{song.artist}</p>
        </div>

        {/* Video & Lyrics Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* YouTube Player */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="aspect-video">
              {youtubeEmbedUrl ? (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full"
                  src={youtubeEmbedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={song.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Không có video YouTube
                </div>
              )}
            </div>
          </div>

          {/* Lyrics Panel */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Lời bài hát</h2>
            </div>
            <div className="h-[400px] overflow-y-auto p-4">
              {lrcLines.length > 0 ? (
                <ul className="space-y-2">
                  {lrcLines.map((line, index) => (
                    <li
                      key={index}
                      ref={el => lyricRefs.current[index] = el}
                      className={`py-2 px-3 rounded-lg transition-all duration-200 ${
                        index === activeLineIndex
                          ? 'bg-cyan-500 text-white font-semibold scale-105 shadow-md'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {line.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Không có lời bài hát (LRC) cho bài này.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SongDetail;