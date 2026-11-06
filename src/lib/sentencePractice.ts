/** Ignore punctuation, whitespace and Unicode presentation differences only. */
export function normalizePracticeSentence(value: string): string {
  return value.normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu, '');
}
export function acceptsPracticeSentence(answer: string, expected: string, alternatives: string[] = []) {
  const normalized = normalizePracticeSentence(answer);
  return [expected, ...alternatives].some(value => normalizePracticeSentence(value) === normalized);
}
export function practiceSegments(sentence: string, segments?: string[]): string[] {
  return (segments ?? [...sentence]).map(normalizePracticeSentence).filter(Boolean);
}
