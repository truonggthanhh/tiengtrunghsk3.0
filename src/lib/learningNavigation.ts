import { msutongBooks, isMsutongLevel, parseMsutongLessonId } from './msutongSelection';
import { BookOpen, BookMarked, Music2, Newspaper, ChartNoAxesCombined, PenLine, Mic2, Layers3, MessageCircle, LibraryBig, Gamepad2, type LucideIcon } from 'lucide-react';
import type { LearningLanguage } from './auth/navigation';

export interface LearningLink { label: string; href: string; icon: LucideIcon; description: string; keywords?: string; }
export const practiceModes = [
  { slug: 'flashcard', label: 'Flashcard', description: 'Lật thẻ, nghe và ghi nhớ từ mới.', icon: Layers3, group: 'vocabulary' },
  { slug: 'pinyin-choice', label: 'Chọn phiên âm', description: 'Kết nối chữ Hán với pinyin.', icon: Mic2, group: 'vocabulary' },
  { slug: 'meaning-choice', label: 'Chọn nghĩa', description: 'Nhận diện nghĩa của từ trong tích tắc.', icon: BookOpen, group: 'vocabulary' },
  { slug: 'fill-in-the-blank', label: 'Điền từ', description: 'Nhớ chữ Hán từ phiên âm và nghĩa.', icon: PenLine, group: 'vocabulary' },
  { slug: 'sentence-choice', label: 'Hoàn thành câu', description: 'Chọn từ phù hợp với ngữ cảnh.', icon: MessageCircle, group: 'sentences' },
  { slug: 'sentence-scramble', label: 'Sắp xếp câu', description: 'Tập tư duy theo trật tự tiếng Trung.', icon: Layers3, group: 'sentences' },
  { slug: 'pronunciation', label: 'Luyện phát âm', description: 'Nghe mẫu và luyện nói thành tiếng.', icon: Mic2, group: 'speaking' },
  { slug: 'enhanced-pronunciation', label: 'Phát âm với AI', description: 'Thực hành phát âm có phản hồi.', icon: Mic2, group: 'speaking' },
  { slug: 'handwriting-practice', label: 'Viết chữ Hán', description: 'Theo từng nét, nhớ từng chữ.', icon: PenLine, group: 'vocabulary' },
  { slug: 'ai-tutor', label: 'Hội thoại với AI', description: 'Luyện phản xạ qua trò chuyện.', icon: MessageCircle, group: 'speaking' },
] as const;
export function learningLinks(language: LearningLanguage): LearningLink[] {
  const base = `/${language}`;
  return [
    { label: language === 'mandarin' ? 'Lộ trình HSK' : 'Bài học', href: language === 'mandarin' ? `${base}#learning-path` : `${base}/lessons`, icon: BookOpen, description: language === 'mandarin' ? 'Chọn cấp độ và dạng bài tập' : 'Khám phá thư viện bài học Quảng Đông', keywords: 'khoa hoc khóa học luyen tap luyện tập' },
    ...(language === 'mandarin' ? [{ label: 'Giáo trình Msutong', href: `${base}/msutong`, icon: LibraryBig, description: 'Học theo giáo trình quen thuộc' }] : []),
    { label: 'Sổ từ cá nhân', href: `${base}/notebook`, icon: BookMarked, description: 'Lưu từ và ôn lại những từ chưa nhớ', keywords: 'so tu flashcard on tap ôn tập' },
    { label: 'Bài hát', href: `${base}/songs`, icon: Music2, description: language === 'mandarin' ? 'Luyện nghe cùng Mandopop' : 'Khám phá giai điệu Cantopop', keywords: 'bai hat nhac âm nhạc' },
    ...(language === 'mandarin' ? [{ label: 'Từ điển Trung – Việt', href: `${base}/dictionary`, icon: BookOpen, description: 'Tra chữ Hán, pinyin và nghĩa tiếng Việt', keywords: 'tu dien tra cuu' }] : []),
    { label: 'Góc đọc', href: `${base}/blog`, icon: Newspaper, description: 'Bài viết về ngôn ngữ và văn hóa', keywords: 'blog bai viet' },
    { label: 'Tiến độ học', href: `${base}/learning-progress`, icon: ChartNoAxesCombined, description: 'Xem lại hành trình học của bạn', keywords: 'tien do thong ke thống kê' },
    { label: 'Phân tích học tập', href: `${base}/analytics`, icon: ChartNoAxesCombined, description: 'Xem thống kê và các nội dung cần ôn thêm', keywords: 'phan tich thong ke analytics' },
    { label: 'Khu trò chơi', href: `${base}/gamification`, icon: Gamepad2, description: 'Đổi nhịp với các hoạt động tương tác', keywords: 'game tro choi' },
  ];
}
export function isLearningLinkActive(href: string, pathname: string, hash = '') {
  const [path, anchor] = href.split('#');
  if (anchor) return pathname === path && hash === `#${anchor}`;
  return pathname === path || pathname.startsWith(`${path}/`);
}
export interface RecentLesson { href: string; label: string; }
/** Only real learning routes can be remembered, never login callbacks or arbitrary URLs. */
export function describeRecentLesson(path: string, language: LearningLanguage): RecentLesson | null {
  const pathname = path.split(/[?#]/)[0];
  if (language === 'mandarin') {
    const match = pathname.match(/^\/mandarin\/hsk\/([1-6])\/([a-z-]+)$/);
    const mode = match && practiceModes.find(item => item.slug === match[2]);
    if (match && mode) return { href: pathname, label: `HSK ${match[1]} · ${mode.label}` };
    const msutong = pathname.match(/^\/mandarin\/msutong\/msutong-([a-z-]+)$/);
    if (msutong) {
      const activity = practiceModes.find(item => item.slug === msutong[1] && item.slug !== 'enhanced-pronunciation');
      const label = msutong[1] === 'reading-comprehension' ? 'Đọc hiểu' : activity?.label;
      const url = new URL(path, 'https://app.invalid');
      const level = url.searchParams.get('level') ?? 'so-cap';
      const ids = [...new Set((url.searchParams.get('lessonIds') ?? '').split(',').filter(id => parseMsutongLessonId(id)))];
      if (!label || !isMsutongLevel(level) || !ids.length) return null;
      const bookNames = msutongBooks.filter(book => ids.some(id => parseMsutongLessonId(id)?.bookSlug === book.slug)).map(book => book.name).join(', ');
      const params = new URLSearchParams({ level, lessonIds: ids.join(','), books: bookNames });
      return { href: `${pathname}?${params}`, label: `Msutong · ${level === 'trung-cap' ? 'Trung cấp · ' : ''}${bookNames} · ${label}` };
    }
  } else if (/^\/cantonese\/(lessons|practice|review)\/[a-zA-Z0-9_-]+(\/[a-z-]+)?$/.test(pathname)) {
    return { href: pathname, label: pathname.includes('/lessons/') ? 'Bài học Quảng Đông gần đây' : 'Bài luyện Quảng Đông gần đây' };
  }
  return null;
}
export function recentLessonKey(language: LearningLanguage, userId?: string) { return `haohao.recent-lesson.v1.${language}.${userId || 'guest'}`; }
