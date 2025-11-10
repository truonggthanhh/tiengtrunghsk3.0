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
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex gap-3 mb-4">
        <Link to="/cantonese" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <Home className="h-4 w-4" /> Trang chủ
        </Link>
        <Link to="/cantonese/songs" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <ArrowLeft className="h-4 w-4" /> Quay về danh sách bài hát
        </Link>
      </div>
      <h1 className="text-3xl font-black mb-1 flex items-center gap-2">
        <Music className="h-7 w-7 text-jade" /> {song.title}
      </h1>
      <p className="text-ink/80 mb-4">{song.artist}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-video rounded-2xl overflow-hidden border-2 border-ink/10 shadow-[0_10px_0_#d7c8b6]">
          {youtubeEmbedUrl ? (
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              src={youtubeEmbedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={song.title}
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              Không có video YouTube
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-black/20 p-4 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6] h-[400px] overflow-y-auto">
          <h2 className="font-bold text-xl mb-3">Lời bài hát</h2>
          {lrcLines.length > 0 ? (
            <ul className="space-y-2">
              {lrcLines.map((line, index) => (
                <li
                  key={index}
                  ref={el => lyricRefs.current[index] = el}
                  className={`py-1 px-2 rounded-lg transition-colors ${
                    index === activeLineIndex
                      ? 'bg-verm text-cream font-semibold shadow-md'
                      : 'text-ink/80 dark:text-cream/80'
                  }`}
                >
                  {line.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink/70 dark:text-cream/70">Không có lời bài hát (LRC) cho bài này.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetail;