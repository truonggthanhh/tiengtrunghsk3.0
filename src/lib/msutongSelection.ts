export const msutongLevels = [{ slug: 'so-cap', name: 'Sơ cấp' }, { slug: 'trung-cap', name: 'Trung cấp' }] as const;
export const isMsutongLevel = (level: string) => msutongLevels.some(item => item.slug === level);
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
export function msutongBookUrl(bookSlug: string, level = 'so-cap') {
  return `/mandarin/msutong?${new URLSearchParams({ level, bookSlugs: bookSlug })}`;
}

export function getMsutongDistractors(words: { hanzi: string; pinyin: string; meaning: string }[], current: { hanzi: string; pinyin: string; meaning: string }, field: 'pinyin' | 'meaning') {
  const normalize = (value: string) => value.trim().normalize('NFC');
  const validAnswers = new Set([normalize(current[field]), ...words.filter(word => normalize(word.hanzi) === normalize(current.hanzi)).map(word => normalize(word[field]))]);
  return [...new Set(words.filter(word => normalize(word.hanzi) !== normalize(current.hanzi)).map(word => word[field].trim()).filter(value => value && !validAnswers.has(normalize(value))))];
}

// Slash alternatives and parenthesized optional parts are printed in the books.
export function acceptsMsutongAnswer(answer: string, hanzi: string) {
  const normalize = (value: string) => value.normalize('NFKC').replace(/\s/g, '');
  const input = normalize(answer);
  return hanzi.split('/').some(part => {
    const normalized = normalize(part);
    return [normalized, normalized.replace(/[()]/g, ''), normalized.replace(/\([^)]*\)/g, '')].includes(input);
  });
}
