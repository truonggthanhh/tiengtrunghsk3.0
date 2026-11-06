import { writeFileSync } from 'node:fs';
import { getFullMsutongVocabularyByLevel, getVocabularyByMsutong, getSentenceExercisesByMsutong, getReadingComprehensionByMsutong } from '../src/data/index';
import sentences from '../src/data/practice/sentences.json';
import readings from '../src/data/practice/readings.json';
import imports from '../src/data/textbooks/vocabulary.json';
import { acceptsPracticeSentence, practiceSegments } from '../src/lib/sentencePractice';
const errors: string[] = [];
const ids = new Set<number>();
const coverage = [];
for (const level of ['so-cap', 'trung-cap', 'cao-cap', 'boya', 'han-ngu', 'hsk-standard']) {
  const words = getFullMsutongVocabularyByLevel(level);
  for (const word of words) {
    if (ids.has(word.id)) errors.push(`Duplicate ID: ${word.id}`); ids.add(word.id);
    if (!word.hanzi || !word.pinyin || !word.meaning) errors.push(`Empty fields: ${word.id}`);
  }
  for (const lessonId of new Set(words.map(word => `${word.bookSlug}-lesson-${word.lesson}`))) {
    const examples = getSentenceExercisesByMsutong(level, [lessonId]);
    const uniqueSentences = new Set(examples.map(item => item.sentence)).size;
    const passages = getReadingComprehensionByMsutong(level, [lessonId]);
    if (uniqueSentences < 6) errors.push(`Thin sentence pool: ${level}/${lessonId} (${uniqueSentences})`);
    if (['so-cap', 'trung-cap', 'cao-cap'].includes(level) && !passages.length) errors.push(`Missing reading: ${level}/${lessonId}`);
    coverage.push({ level, lessonId, words: getVocabularyByMsutong(level, [lessonId]).length, sentenceCompletion: examples.length, sentenceScramble: uniqueSentences, readings: passages.length });
  }
}
for (const row of sentences) {
  if (row.sentence.split(row.target).length !== 2) errors.push(`Invalid blank target ${row.id}`);
  if (!acceptsPracticeSentence(practiceSegments(row.sentence, row.segments).join(''), row.sentence)) errors.push(`Invalid phrase tiles ${row.id}`);
}
for (const row of readings) for (const question of row.questions) {
  if (question.options.length !== 4 || new Set(question.options).size !== 4 || !question.options[question.correctAnswerIndex]) errors.push(`Invalid reading answer: ${row.id}`);
}
for (const word of imports) {
  if (word.meaningLanguage !== 'vi' || /[1-5\p{Script=Han}]/u.test(word.pinyin)) errors.push(`Unfinished gloss/pinyin: ${word.id}`);
}
const report = { authoredSentences: sentences.length, originalReadingPassages: readings.length, originalReadingQuestions: readings.reduce((n, r) => n + r.questions.length, 0), communityVocabulary: imports.length, catalogVocabulary: ids.size, lessons: coverage.length, coverage, errors };
writeFileSync('docs/textbooks/practice-coverage.json', JSON.stringify(report, null, 2) + '\n');
console.log({ ...report, coverage: `${coverage.length} lessons`, errors });
if (errors.length) process.exitCode = 1;
