import { msutongBooks, msutongLevels, parseMsutongLessonId } from './msutongSelection';
export const textbookLevels = [
  { slug: 'boya', name: 'Boya', description: 'Boya sơ cấp II, bản 2: 25 bài từ danh sách cộng đồng. Chưa đối chiếu trọn bộ PDF; chưa gồm các quyển Boya khác.', sourceUrl: 'https://github.com/jay-pee/BoyaChinese_Elementary_II_Vocabulary_List' },
  { slug: 'han-ngu', name: 'Giáo trình Hán ngữ', description: 'Hán ngữ quyển 2: 25 bài theo tệp cộng đồng 初级第二册上. Nguồn chưa xác nhận lần xuất bản; chưa gồm toàn bộ bộ giáo trình 6 quyển.', sourceUrl: 'https://github.com/kevinstadler/pleco-flashcards' },
  { slug: 'hsk-standard', name: 'Giáo trình chuẩn HSK', description: 'Danh sách cộng đồng theo bài của HSK Standard Course 1–5 (7 tập). Có mục bổ sung cuối sách; chưa có HSK 6 và chưa xác minh toàn bộ với PDF.', sourceUrl: 'https://github.com/joelypoley/hsk_standard_course_vocab' },
] as const;
export function isTextbookLevel(level: string) { return textbookLevels.some(item => item.slug === level); }
export function curriculumTitle(level: string) {
  return textbookLevels.find(item => item.slug === level)?.name ?? `Msutong ${msutongLevels.find(item => item.slug === level)?.name ?? ''}`.trim();
}
export function curriculumBooks(level: string): { slug: string; name: string; number: number }[] {
  const titles = level === 'boya' ? ['Sơ cấp II · bản 2'] : level === 'han-ngu' ? ['Quyển 2'] : level === 'hsk-standard' ? ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4 tập 1', 'HSK 4 tập 2', 'HSK 5 tập 1', 'HSK 5 tập 2'] : null;
  return titles ? titles.map((name, i) => ({ slug: `quyen-${i + 1}`, name, number: i + 1 })) : [...msutongBooks];
}
export function curriculumLessonName(lesson: number) { return lesson === 999 ? 'Từ bổ sung cuối sách' : `Bài ${lesson}`; }

export function isCurriculumLessonId(level: string, value: string) {
  const parsed = parseMsutongLessonId(value);
  if (!parsed || !curriculumBooks(level).some(book => book.slug === parsed.bookSlug)) return false;
  const n = parsed.lessonNumber;
  if (msutongLevels.some(item => item.slug === level)) return n <= 10;
  if (level === 'boya' || level === 'han-ngu') return n <= 25;
  if (level !== 'hsk-standard') return false;
  const book = Number(parsed.bookSlug.slice(-1));
  const ranges: Record<number, [number, number]> = { 1: [1, 15], 2: [1, 15], 3: [1, 20], 4: [1, 10], 5: [11, 20], 6: [1, 18], 7: [19, 36] };
  return (book === 4 && n === 999) || (n >= ranges[book][0] && n <= ranges[book][1]);
}
