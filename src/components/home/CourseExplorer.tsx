import { normalizeSearchText as fold } from '@/lib/searchText';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, LibraryBig, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { practiceModes } from '@/lib/learningNavigation';
import { cn } from '@/lib/utils';

const groups = [{ key: 'all', label: 'Tất cả' }, { key: 'vocabulary', label: 'Từ vựng & chữ Hán' }, { key: 'sentences', label: 'Luyện câu' }, { key: 'speaking', label: 'Nghe & nói' }];
export default function CourseExplorer() {
  const [level, setLevel] = useState('1');
  const [group, setGroup] = useState('all');
  const [search, setSearch] = useState('');
  const modes = practiceModes.filter(mode => (group === 'all' || mode.group === group) && fold(`${mode.label} ${mode.description}`).includes(fold(search.trim())));
  return <section id="learning-path" className="learning-section scroll-mt-24" aria-labelledby="course-explorer-title">
    <div className="section-heading"><div><p className="section-eyebrow">LỘ TRÌNH CỦA BẠN</p><h2 id="course-explorer-title">Bắt đầu từ nơi bạn đang đứng.</h2><p>Chọn cấp độ, chọn kỹ năng. Bạn có thể đổi bất cứ lúc nào.</p></div><Link to="/mandarin/msutong" className="section-text-link"><LibraryBig className="h-4 w-4" />Học theo Msutong<ArrowUpRight className="h-4 w-4" /></Link></div>
    <div className="course-explorer-panel">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center"><div role="group" aria-label="Chọn cấp độ HSK" className="flex flex-wrap gap-1.5">{[1, 2, 3, 4, 5, 6].map(value => <button key={value} type="button" aria-pressed={level === String(value)} className={cn('level-pill', level === String(value) && 'is-selected')} onClick={() => setLevel(String(value))}>HSK {value}</button>)}</div><p className="text-xs text-muted-foreground">{level === '1' ? 'Làm quen với nền tảng' : Number(level) <= 3 ? 'Xây chắc vốn từ & phản xạ' : 'Mở rộng kỹ năng của bạn'}</p></div>
      <div className="my-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div className="flex flex-wrap gap-2" role="group" aria-label="Lọc kỹ năng">{groups.map(item => <button type="button" key={item.key} aria-pressed={group === item.key} className={cn('skill-filter', group === item.key && 'is-selected')} onClick={() => setGroup(item.key)}>{item.label}</button>)}</div><div className="relative lg:w-60"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Tìm dạng bài tập" placeholder="Tìm dạng bài tập…" value={search} onChange={event => setSearch(event.target.value)} className="rounded-xl pl-9" /></div></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">{modes.map(mode => <Link key={mode.slug} to={`/mandarin/hsk/${level}/${mode.slug}`} className="exercise-choice group"><span className="exercise-icon"><mode.icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="font-semibold">{mode.label}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{mode.description}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>)}</div>
      {!modes.length && <div role="status" className="rounded-xl border border-dashed py-12 text-center"><Search className="mx-auto mb-3 h-6 w-6 text-muted-foreground" /><p className="font-medium">Chưa tìm thấy dạng bài phù hợp.</p><button type="button" className="mt-2 text-sm text-primary underline" onClick={() => { setSearch(''); setGroup('all'); }}>Xóa bộ lọc và xem tất cả</button></div>}
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><BookOpen className="h-4 w-4" />Các bài tập đang hiển thị dành cho HSK {level}.</p>
    </div>
  </section>;
}
