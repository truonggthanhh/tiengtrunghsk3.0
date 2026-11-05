export const msutongBooks = [
  { slug: 'quyen-1', name: 'Quyển 1', number: 1 },
  { slug: 'quyen-2', name: 'Quyển 2', number: 2 },
  { slug: 'quyen-3', name: 'Quyển 3', number: 3 },
  { slug: 'quyen-4', name: 'Quyển 4', number: 4 },
] as const;
export function parseMsutongLessonId(value: string) {
  const match = /^quyen-([1-4])-lesson-([1-9]\d{0,2})$/.exec(value);
  return match ? { bookSlug: `quyen-${match[1]}`, lessonNumber: Number(match[2]) } : null;
}
export function msutongBookUrl(bookSlug: string) {
  return `/mandarin/msutong?${new URLSearchParams({ level: 'so-cap', bookSlugs: bookSlug })}`;
}

export function getMsutongDistractors(words: { hanzi: string; pinyin: string; meaning: string }[], current: { hanzi: string; pinyin: string; meaning: string }, field: 'pinyin' | 'meaning') {
  const normalize = (value: string) => value.trim().normalize('NFC');
  return [...new Set(words.filter(word => normalize(word.hanzi) !== normalize(current.hanzi)).map(word => word[field].trim()).filter(value => value && normalize(value) !== normalize(current[field])))];
}
