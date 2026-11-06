import { curriculumBooks, curriculumTitle, curriculumLessonName, textbookLevels, isTextbookLevel } from '@/lib/textbookCatalog';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, LibraryBig } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/SessionContextProvider.shared';
import { getSentenceExercisesByMsutong, getFullMsutongVocabularyByLevel, getVocabularyByMsutong, getReadingComprehensionByMsutong } from '@/data';
import { msutongLevels, isMsutongLevel, parseMsutongLessonId } from '@/lib/msutongSelection';
import { practiceModes } from '@/lib/learningNavigation';
import { cn } from '@/lib/utils';

export default function MsutongPage() {
  const { session, isLoading } = useSession();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const level = params.get('level') ?? 'so-cap';
  const msutongBooks = curriculumBooks(level);
  const community = textbookLevels.find(item => item.slug === level);
  const catalog = getFullMsutongVocabularyByLevel(level);
  const lessons = msutongBooks.flatMap(book => [...new Set(catalog.filter(word => word.bookSlug === book.slug).map(word => word.lesson))].sort((a, b) => a - b).map(lesson => ({ id: `${book.slug}-lesson-${lesson}`, bookSlug: book.slug, lesson, count: catalog.filter(word => word.bookSlug === book.slug && word.lesson === lesson).length })));
  const validLessonIds = new Set(lessons.map(lesson => lesson.id));

  const requestedIds = [...new Set((params.get('lessonIds') ?? '').split(',').filter(Boolean))];
  const selectedLessons = requestedIds.filter(id => validLessonIds.has(id));
  const requestedBooks = [...(params.get('bookSlugs') ?? '').split(','), ...selectedLessons.map(id => parseMsutongLessonId(id)!.bookSlug)];
  const selectedBooks = msutongBooks.filter(book => requestedBooks.includes(book.slug)).map(book => book.slug);
  const words = getVocabularyByMsutong(level, selectedLessons);
  const reading = getReadingComprehensionByMsutong(level, selectedLessons);
  const sentenceExercises = getSentenceExercisesByMsutong(level, selectedLessons);
  const sentenceCount = sentenceExercises.length;
  const scrambleCount = new Set(sentenceExercises.map(item => item.sentence)).size;
  const canPractice = selectedLessons.length > 0 && words.length > 0;
  const exercises = [...practiceModes.filter(mode => mode.slug !== 'enhanced-pronunciation'), { slug: 'reading-comprehension', label: 'Đọc hiểu', description: 'Đọc đoạn văn và trả lời câu hỏi.', icon: BookOpen, group: 'sentences' }];
  const exerciseParams = new URLSearchParams({ level, lessonIds: selectedLessons.join(','), books: msutongBooks.filter(book => selectedBooks.includes(book.slug)).map(book => book.name).join(', ') });
  function select(books: string[], ids: string[]) {
    const allowedBooks = msutongBooks.filter(book => books.includes(book.slug)).map(book => book.slug);
    const allowedIds = lessons.filter(lesson => allowedBooks.includes(lesson.bookSlug as typeof allowedBooks[number]) && ids.includes(lesson.id)).map(lesson => lesson.id);
    setParams({ level, bookSlugs: allowedBooks.join(','), lessonIds: allowedIds.join(',') });
  }
  return <div className="learning-ui min-h-screen bg-background" data-language="mandarin"><Header /><main id="main-content" className="learning-container py-8 sm:py-12">
    <Link to="/mandarin" className="text-xs text-muted-foreground hover:text-primary">Trang chủ <span className="px-2">/</span> Thư viện giáo trình</Link>
    <div className="section-heading mt-8"><div><p className="section-eyebrow">THƯ VIỆN GIÁO TRÌNH</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Học theo quyển. Ôn theo bài.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Chọn một hoặc nhiều quyển, chọn bài học rồi mở flashcard hoặc hoạt động bạn muốn luyện.</p></div></div>
    {isLoading ? <p role="status" className="py-12 text-center">Đang kiểm tra phiên đăng nhập…</p> : !session ? <section className="library-empty"><LibraryBig className="mx-auto h-8 w-8 text-primary" /><h2 className="mt-5 text-xl font-bold">Đăng nhập để học giáo trình</h2><p className="mt-3 text-sm text-muted-foreground">{curriculumTitle(level)} · {msutongBooks.map(book => book.name).join(" · ")}</p><Button asChild className="mt-6 rounded-full"><Link to={`/mandarin/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`}>Đăng nhập để học<ArrowRight /></Link></Button></section> : (!isMsutongLevel(level) && !isTextbookLevel(level)) ? <section className="library-empty"><h2 className="text-xl font-bold">Chưa có bộ từ cho cấp độ này</h2><p className="mt-3 text-sm text-muted-foreground">Hiện có Msutong sơ cấp, trung cấp, cao cấp, Boya, Hán ngữ và giáo trình chuẩn HSK.</p><Button className="mt-5" onClick={() => setParams({ level: 'so-cap' })}>Mở Msutong sơ cấp</Button></section> : <>
      <div role="group" aria-label="Cấp độ Msutong" className="mb-5 flex flex-wrap gap-2">{[...msutongLevels, ...textbookLevels].map(item => <Button key={item.slug} variant={level === item.slug ? 'default' : 'outline'} aria-pressed={level === item.slug} onClick={() => setParams({ level: item.slug })}>{item.name}</Button>)}</div>
      {community && <p className="mb-3 text-sm"><a className="underline" href={community.sourceUrl} target="_blank" rel="noreferrer">Xem nguồn danh sách từ</a></p>}
      <p className="mb-5 text-sm leading-6 text-muted-foreground">{community ? community.description : level === 'cao-cap' ? '4 quyển cao cấp: 40 bài, đủ 6 bảng từ vựng mỗi bài, kèm các mục bổ sung từ bảng cuối sách. Quyển 2 có nghĩa tiếng Việt dịch từ tiếng Anh; các mục bổ sung có nghĩa tiếng Việt biên soạn.' : level === 'trung-cap' ? '4 quyển trung cấp: từ vựng theo bảng cuối sách, kèm thành ngữ và tên riêng. Nghĩa tiếng Việt được biên soạn cho thẻ học.' : 'Từ vựng đã đối chiếu 4 quyển sơ cấp PDF, gồm từ mới, từ thành phần và danh từ riêng.'} Câu ví dụ và bài đọc là nội dung luyện tập bổ sung, không phải trích nguyên văn giáo trình. <a className="underline" href={community ? `/data/textbooks/${level}-vocabulary.csv` : level === 'cao-cap' ? '/data/msutong-advanced-vocabulary.csv' : level === 'trung-cap' ? '/data/msutong-intermediate-vocabulary.csv' : '/data/msutong-vocabulary.csv'} download>Tải bộ từ CSV</a></p>
      <section aria-labelledby="msutong-books-title" className="rounded-2xl border bg-card p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="section-eyebrow">BƯỚC 1</p><h2 id="msutong-books-title" className="mt-2 text-xl font-bold">Chọn quyển</h2></div><Button variant="outline" size="sm" onClick={() => select(msutongBooks.map(book => book.slug), selectedLessons)}>{msutongBooks.length === 4 ? 'Chọn cả 4 quyển' : 'Chọn tất cả quyển'}</Button></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{msutongBooks.map(book => {
        const active = selectedBooks.includes(book.slug);
        return <button type="button" key={book.slug} aria-label={`Chọn ${book.name}`} aria-pressed={active} className={cn('relative rounded-2xl border p-4 text-left transition-colors hover:border-primary/50 sm:p-5', active && 'border-primary bg-primary/5')} onClick={() => select(active ? selectedBooks.filter(slug => slug !== book.slug) : [...selectedBooks, book.slug], selectedLessons)}><span className="flex items-center justify-between"><LibraryBig className="h-5 w-5 text-primary" />{active && <Check className="h-4 w-4 text-primary" />}</span><span className="mt-4 block text-lg font-bold">{book.name}</span><span className="mt-2 block text-xs leading-5 text-muted-foreground">{lessons.filter(lesson => lesson.bookSlug === book.slug).length} bài · {catalog.filter(word => word.bookSlug === book.slug).length} mục từ {community ? 'cộng đồng' : 'theo PDF'}</span></button>;
      })}</div></section>
      {selectedBooks.length > 0 && <section id="msutong-lessons" aria-labelledby="msutong-lessons-title" className="mt-6 rounded-2xl border bg-card p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="section-eyebrow">BƯỚC 2</p><h2 id="msutong-lessons-title" className="mt-2 text-xl font-bold">Chọn bài học</h2></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => select(selectedBooks, lessons.filter(lesson => selectedBooks.includes(lesson.bookSlug as typeof selectedBooks[number])).map(lesson => lesson.id))}>Chọn tất cả bài</Button><Button variant="ghost" size="sm" disabled={!selectedLessons.length} onClick={() => select(selectedBooks, [])}>Bỏ chọn bài</Button></div></div>{msutongBooks.filter(book => selectedBooks.includes(book.slug)).map(book => <div key={book.slug} className="mb-6 last:mb-0"><h3 className="mb-3 text-sm font-bold">{book.name}</h3><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{lessons.filter(lesson => lesson.bookSlug === book.slug).map(lesson => <button type="button" key={lesson.id} aria-pressed={selectedLessons.includes(lesson.id)} aria-label={`${book.name} · Bài ${lesson.lesson}`} className={cn('rounded-xl border p-3 text-left text-sm hover:border-primary/50', selectedLessons.includes(lesson.id) && 'border-primary bg-primary/5')} onClick={() => select(selectedBooks, selectedLessons.includes(lesson.id) ? selectedLessons.filter(id => id !== lesson.id) : [...selectedLessons, lesson.id])}><span className="font-semibold">{curriculumLessonName(lesson.lesson)}</span><span className="mt-1 block text-xs text-muted-foreground">{lesson.count} mục từ</span></button>)}</div></div>)}</section>}
      {requestedIds.some(id => !validLessonIds.has(id)) && <p role="status" className="mt-4 text-sm text-muted-foreground">Một số mã bài trong liên kết không hợp lệ hoặc chưa có dữ liệu. Hãy chọn lại bài từ danh sách.</p>}
      <section id="msutong-exercises" aria-labelledby="msutong-exercises-title" className="mt-6"><div className="section-heading"><div><p className="section-eyebrow">BƯỚC 3</p><h2 id="msutong-exercises-title">Chọn hoạt động luyện tập</h2><p role="status">{selectedLessons.length} bài đã chọn · {words.length} mục từ {community ? 'theo danh sách cộng đồng' : 'theo PDF'}</p></div></div>{!canPractice && <p className="mb-4 text-sm text-muted-foreground">Chọn quyển và ít nhất một bài để bắt đầu.</p>}<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{exercises.map(exercise => {
        const available = canPractice && (exercise.slug === 'reading-comprehension' ? reading.length > 0 : exercise.slug === 'sentence-choice' || exercise.slug === 'sentence-scramble' ? sentenceCount > 0 : true);
        const content = <><span className="exercise-icon"><exercise.icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block font-semibold">{exercise.label}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{!available && canPractice ? 'Chưa có nội dung cho các bài đang chọn.' : exercise.description}{available && (exercise.slug === 'sentence-choice' || exercise.slug === 'sentence-scramble') && ` · ${exercise.slug === 'sentence-scramble' ? scrambleCount : sentenceCount} câu`}{available && exercise.slug === 'reading-comprehension' && ` · ${reading.length} đoạn`}</span></span>{available && <ArrowRight className="h-4 w-4 shrink-0" />}</>;
        return available ? <Link key={exercise.slug} className="exercise-choice" to={`/mandarin/msutong/msutong-${exercise.slug}?${exerciseParams}`}>{content}</Link> : <div key={exercise.slug} className="exercise-choice opacity-60" aria-disabled="true">{content}</div>;
      })}</div></section>
    </>}
  </main></div>;
}
