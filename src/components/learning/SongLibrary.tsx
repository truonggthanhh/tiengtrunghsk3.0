import ContentLoadNotice from './ContentLoadNotice';
import { normalizeSearchText as fold } from '@/lib/searchText';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Headphones, Play, Search } from 'lucide-react';
import { learningClient } from '@/hooks/useLearningSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { LearningLanguage } from '@/lib/auth/navigation';

export default function SongLibrary({ language }: { language: LearningLanguage }) {
  const [search, setSearch] = useState('');
  const query = useQuery({
    queryKey: language === 'mandarin' ? ['songs'] : ['cantonese', 'songs'],
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    queryFn: async ({ signal }) => {
      const { data, error } = await learningClient(language).from('songs').select('id, title, artist').order('created_at', { ascending: false }).abortSignal(signal);
      if (error) throw error;
      return data ?? [];
    },
  });
  const songs = (query.data ?? []).filter(song => fold(`${song.title} ${song.artist ?? ''}`).includes(fold(search.trim())));
  return <main id="main-content" className="learning-ui learning-container py-8 sm:py-12" data-language={language}>
    <Link to={`/${language}`} className="text-xs text-muted-foreground hover:text-primary">Trang chủ <span className="px-2">/</span> Bài hát</Link>
    <div className="section-heading mt-8"><div><p className="section-eyebrow">{language === 'mandarin' ? 'MANDOPOP' : 'CANTOPOP'} · NGHE & CẢM NHẬN</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Để giai điệu dẫn đường.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Chọn một bài hát bạn thích. Nghe, theo dõi lời và làm quen những cách diễn đạt mới.</p></div></div>
    <div className="relative mb-6 max-w-lg"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Tìm bài hát" placeholder="Tên bài hát hoặc nghệ sĩ…" value={search} onChange={event => setSearch(event.target.value)} className="rounded-xl pl-9" /></div>
    {query.isLoading ? <div role="status" aria-label="Đang tải bài hát" className="grid gap-4 sm:grid-cols-2">{[1, 2, 3, 4].map(value => <div key={value} className="h-28 animate-pulse rounded-2xl border bg-muted" />)}</div> : query.error && !query.data ? <ContentLoadNotice resource="bài hát" error={query.error} retry={() => query.refetch()} pending={query.isFetching} /> : <>{query.error && <ContentLoadNotice cached resource="bài hát" error={query.error} retry={() => query.refetch()} pending={query.isFetching} />}<p role="status" className="mb-4 text-xs text-muted-foreground">{songs.length} bài hát{search.trim() ? ' phù hợp' : ' để khám phá'}</p>{songs.length ? <div className="grid gap-4 sm:grid-cols-2">{songs.map(song => <Link key={song.id} to={`/${language}/songs/${song.id}`} className="library-lesson group"><span className="library-lesson-number"><Play className="h-4 w-4" fill="currentColor" /></span><div className="min-w-0 flex-1"><h2 className="break-words text-base font-bold leading-6">{song.title}</h2><p className="mt-2 text-xs text-muted-foreground">{song.artist || 'Khám phá lời bài hát'}</p></div><ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>)}</div> : <div className="library-empty"><Headphones className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 text-lg font-bold">{search ? 'Chưa tìm thấy giai điệu này' : 'Những giai điệu mới đang được cập nhật'}</h2><p className="mt-3 text-sm text-muted-foreground">{search ? 'Thử tìm theo nghệ sĩ hoặc một từ khóa khác.' : 'Bạn có thể ghé lại sau hoặc tiếp tục học với sổ từ.'}</p>{search && <Button variant="outline" className="mt-5 rounded-full" onClick={() => setSearch('')}>Xóa tìm kiếm</Button>}</div>}</>}
  </main>;
}
