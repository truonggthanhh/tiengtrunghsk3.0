import { normalizeSearchText as fold } from '@/lib/searchText';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookMarked, BookOpen, LayoutGrid, List, LockKeyhole, Search } from 'lucide-react';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider.shared';
import { useProfile } from '@/cantonese/components/providers/ProfileProvider.shared';
import LessonCard from '@/cantonese/components/LessonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { oneRelation } from '@/lib/relations';
import { useLessonAccess, canOpenLesson } from '@/cantonese/hooks/useLessonAccess';
import { cn } from '@/lib/utils';

export default function LessonsPage() {
  const { session, isLoading: checkingSession } = useSession();
  const { isAdmin, isLoadingProfile } = useProfile();
  const lessonAccess = useLessonAccess(session?.user.id, !checkingSession);
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('all');
  const [view, setView] = useState('grid');
  const lessonsQuery = useQuery({
    queryKey: ['cantonese', 'lessons-with-courses', session?.user.id],
    enabled: !checkingSession && Boolean(session),
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.from('lessons').select('*, courses(id, name, is_free)').order('position', { ascending: true, nullsFirst: false }).abortSignal(signal);
      if (error) throw error;
      return (data ?? []).map(lesson => ({ ...lesson, courses: oneRelation(lesson.courses) }));
    },
  });
  const access = useQuery({
    queryKey: ['cantonese', 'user-course-access', session?.user.id], enabled: !checkingSession && Boolean(session),
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.from('user_course_access').select('course_id').eq('user_id', session!.user.id).abortSignal(signal);
      if (error) throw error;
      return (data ?? []).map(item => item.course_id);
    },
  });
  const lessons = useMemo(() => (lessonsQuery.data ?? []).filter(lesson => canOpenLesson(lesson, session?.user.id, isAdmin, access.data, lessonAccess.data)), [lessonsQuery.data, access.data, lessonAccess.data, session?.user.id, isAdmin]);
  const courses = [...new Map(lessons.filter(lesson => lesson.courses).map(lesson => [lesson.courses!.id, lesson.courses!])).values()];
  const filtered = lessons.filter(lesson => (course === 'all' || lesson.course_id === course) && fold(`${lesson.title} ${lesson.description ?? ''}`).includes(fold(search.trim())));
  const loading = checkingSession || lessonsQuery.isLoading || access.isLoading || lessonAccess.isLoading || isLoadingProfile;
  const error = lessonsQuery.error || access.error || lessonAccess.error;
  return <main id="main-content" className="learning-container py-8 sm:py-12">
    <Link to="/cantonese" className="text-xs text-muted-foreground hover:text-primary">Trang chủ <span className="px-2">/</span> Thư viện bài học</Link>
    <div className="section-heading mt-8"><div><p className="section-eyebrow">THƯ VIỆN TIẾNG QUẢNG ĐÔNG</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Một bài học. Một bước tiến.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Chọn bài bạn muốn học, khám phá nội dung và luyện tập từng kỹ năng theo nhịp của mình.</p></div></div>
    {!checkingSession && !session ? <section className="library-empty"><span className="quickbar-icon mx-auto"><LockKeyhole className="h-5 w-5" /></span><h2 className="mt-5 text-xl font-bold">Mở thư viện học của bạn</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">Đăng nhập để xem các bài học bạn có quyền truy cập và tiếp tục hành trình tiếng Quảng.</p><Button asChild className="mt-6 rounded-full"><Link to={`/cantonese/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`}>Đăng nhập để học<ArrowRight /></Link></Button></section> : <>
      <div className="library-toolbar"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Tìm bài học" placeholder="Tìm theo tên bài học hoặc nội dung…" value={search} onChange={event => setSearch(event.target.value)} className="rounded-xl pl-9" /></div><Select value={course} onValueChange={setCourse}><SelectTrigger className="w-full rounded-xl sm:w-52" aria-label="Lọc khóa học"><SelectValue placeholder="Tất cả khóa học" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả khóa học</SelectItem>{courses.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select><div className="flex gap-1 rounded-xl border bg-card p-1" role="group" aria-label="Kiểu hiển thị"><Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-9 rounded-lg" aria-label="Xem dạng lưới" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><LayoutGrid /></Button><Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-9 rounded-lg" aria-label="Xem dạng danh sách" aria-pressed={view === 'list'} onClick={() => setView('list')}><List /></Button></div></div>
      {loading ? <div role="status" aria-label="Đang tải bài học" className="grid gap-4 sm:grid-cols-2">{[1, 2, 3, 4].map(value => <div key={value} className="h-36 animate-pulse rounded-2xl border bg-muted" />)}<span className="sr-only">Đang tải bài học…</span></div> : error ? <div role="alert" className="library-empty"><h2 className="text-lg font-bold">Chưa tải được thư viện</h2><p className="mt-3 text-sm text-muted-foreground">Hãy kiểm tra kết nối và thử lại. Nội dung của bạn vẫn được giữ nguyên.</p><Button variant="outline" className="mt-5 rounded-full" onClick={() => { void lessonsQuery.refetch(); void access.refetch(); void lessonAccess.refetch(); }}>Thử lại</Button></div> : <><p role="status" className="mb-4 text-xs text-muted-foreground">{filtered.length} bài học{search.trim() ? ` phù hợp với “${search.trim()}”` : ' trong thư viện của bạn'}</p>{filtered.length ? <div className={cn('grid gap-4', view === 'grid' && 'lg:grid-cols-2')}>{filtered.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} index={index} />)}</div> : <div className="library-empty"><Search className="mx-auto h-7 w-7 text-muted-foreground" /><h2 className="mt-4 text-lg font-bold">{lessons.length ? 'Chưa tìm thấy bài học phù hợp' : 'Chưa có bài học trong thư viện'}</h2><p className="mt-3 text-sm text-muted-foreground">{lessons.length ? 'Thử một từ khóa khác hoặc chọn lại khóa học.' : 'Các bài học được cấp quyền sẽ xuất hiện tại đây.'}</p>{lessons.length > 0 && <Button variant="outline" className="mt-5 rounded-full" onClick={() => { setSearch(''); setCourse('all'); }}>Xóa bộ lọc</Button>}</div>}</>}
    </>}
    <section className="learning-quickbar mt-8"><div className="quickbar-lead"><BookMarked className="h-6 w-6 shrink-0 text-primary" /><div><h2 className="text-sm font-bold">Đừng để từ mới trôi qua.</h2><p className="mt-1 text-xs text-muted-foreground">Lưu vào sổ từ và ôn lại theo cách của bạn.</p></div></div><Button asChild variant="outline" className="rounded-full"><Link to="/cantonese/notebook">Mở sổ từ<ArrowRight /></Link></Button></section>
  </main>;
}
